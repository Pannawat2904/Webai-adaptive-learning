'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '@/types/database';
import { MOCK_PROFILES } from './mock-data';
import { createClient } from './supabase/client';

interface AuthContextType {
  profile: Profile;
  role: UserRole;
  isLiveSupabase: boolean;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  loginWithCredentials: (username: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  loginAsStudent: (studentId?: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  auditLog: (action: string, entity: string, details?: Record<string, unknown>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILES.student);
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage for saved role & admin auth token
    const savedRole = localStorage.getItem('webai_demo_role') as UserRole;
    const isAuth = localStorage.getItem('webai_admin_auth') === 'true';

    if (savedRole && MOCK_PROFILES[savedRole]) {
      if (savedRole === 'teacher' || savedRole === 'admin') {
        if (isAuth) {
          setRole(savedRole);
          setProfile(MOCK_PROFILES[savedRole]);
          setIsAdminAuthenticated(true);
        } else {
          // Default to student if not authenticated with password
          setRole('student');
          setProfile(MOCK_PROFILES.student);
          setIsAdminAuthenticated(false);
        }
      } else {
        setRole('student');
        setProfile(MOCK_PROFILES.student);
      }
    }

    const supabase = createClient();
    if (supabase) {
      setIsLiveSupabase(true);
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setProfile(data);
                setRole(data.role || 'student');
              }
            });
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  /**
   * เข้าสู่ระบบสำหรับครูและแอดมิน ด้วย Username และ Password
   * ครู: username = 'teacher' (หรือ kanrawee), password = 'teacher1234'
   * แอดมิน: username = 'admin', password = 'admin1234'
   */
  const loginWithCredentials = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check Teacher credentials
    if (
      (cleanUser === 'teacher' ||
        cleanUser === 'kanrawee' ||
        cleanUser === 'teacher@vec.mail.go.th') &&
      cleanPass === 'teacher1234'
    ) {
      setRole('teacher');
      setProfile(MOCK_PROFILES.teacher);
      setIsAdminAuthenticated(true);
      localStorage.setItem('webai_demo_role', 'teacher');
      localStorage.setItem('webai_admin_auth', 'true');
      auditLog('login_success', 'auth', { role: 'teacher', username: cleanUser });
      return { success: true, role: 'teacher' };
    }

    // Check Admin credentials
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@vec.mail.go.th') &&
      cleanPass === 'admin1234'
    ) {
      setRole('admin');
      setProfile(MOCK_PROFILES.admin);
      setIsAdminAuthenticated(true);
      localStorage.setItem('webai_demo_role', 'admin');
      localStorage.setItem('webai_admin_auth', 'true');
      auditLog('login_success', 'auth', { role: 'admin', username: cleanUser });
      return { success: true, role: 'admin' };
    }

    auditLog('login_failed', 'auth', { username: cleanUser });
    return {
      success: false,
      error: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง (สำหรับทดสอบ: teacher / teacher1234 หรือ admin / admin1234)',
    };
  };

  /**
   * เข้าใช้งานฝั่งนักเรียน (Student Portal) ได้โดยตรง
   */
  const loginAsStudent = (studentId?: string) => {
    setRole('student');
    setProfile(MOCK_PROFILES.student);
    setIsAdminAuthenticated(false);
    localStorage.setItem('webai_demo_role', 'student');
    localStorage.removeItem('webai_admin_auth');
    auditLog('student_access', 'portal', { studentId: studentId || MOCK_PROFILES.student.id });
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (MOCK_PROFILES[newRole]) {
      setProfile(MOCK_PROFILES[newRole]);
      localStorage.setItem('webai_demo_role', newRole);
      if (newRole === 'teacher' || newRole === 'admin') {
        localStorage.setItem('webai_admin_auth', 'true');
        setIsAdminAuthenticated(true);
      } else {
        localStorage.removeItem('webai_admin_auth');
        setIsAdminAuthenticated(false);
      }
    }
    auditLog('switch_role', 'profile', { newRole });
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } else {
      loginAsStudent();
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setProfile(MOCK_PROFILES.student);
    setRole('student');
    setIsAdminAuthenticated(false);
    localStorage.removeItem('webai_demo_role');
    localStorage.removeItem('webai_admin_auth');
  };

  const auditLog = (action: string, entity: string, details?: Record<string, unknown>) => {
    try {
      const logs = JSON.parse(localStorage.getItem('webai_audit_logs') || '[]');
      logs.unshift({
        id: 'log-' + Date.now(),
        actor_id: profile.id,
        actor_name: profile.full_name,
        actor_role: role,
        action,
        entity,
        details,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('webai_audit_logs', JSON.stringify(logs.slice(0, 100)));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        role,
        isLiveSupabase,
        isLoading,
        isAdminAuthenticated,
        switchRole,
        loginWithCredentials,
        loginAsStudent,
        signInWithGoogle,
        signOut,
        auditLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
