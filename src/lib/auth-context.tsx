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
   * แอดมิน (Super Admin): username = 'Admin', password = 'BallOOn84524092_*'
   */
  const loginWithCredentials = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Custom Users from LocalStorage (created by Super Admin)
    try {
      const customUsersStr = localStorage.getItem('webai_custom_users');
      if (customUsersStr) {
        const customUsers = JSON.parse(customUsersStr);
        const matchedUser = customUsers.find((u: any) => u.username.toLowerCase() === cleanUser && u.password === cleanPass);
        
        if (matchedUser) {
          const role = matchedUser.role as UserRole;
          setRole(role);
          setProfile({
            id: matchedUser.id,
            role: role,
            full_name: matchedUser.full_name || matchedUser.username,
            email: matchedUser.username,
            created_at: new Date().toISOString()
          });
          setIsAdminAuthenticated(true);
          localStorage.setItem('webai_demo_role', role);
          localStorage.setItem('webai_admin_auth', 'true');
          auditLog('login_success', 'auth', { role: role, username: cleanUser, type: 'custom_user' });
          return { success: true, role: role };
        }
      }
    } catch (e) {
      console.error('Error parsing custom users', e);
    }

    // 2. Check Super Admin credentials via Secure Server API
    try {
      const response = await fetch('/api/auth/superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.role === 'admin') {
          setRole('admin');
          setProfile(MOCK_PROFILES.admin);
          setIsAdminAuthenticated(true);
          localStorage.setItem('webai_demo_role', 'admin');
          localStorage.setItem('webai_admin_auth', 'true');
          auditLog('login_success', 'auth', { role: 'admin', username: cleanUser, type: 'secure_api' });
          return { success: true, role: 'admin' };
        }
      }
    } catch (e) {
      console.error('Secure login check failed', e);
    }

    // 3. Fallback to default demo teacher
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

    auditLog('login_failed', 'auth', { username: cleanUser });
    return {
      success: false,
      error: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
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
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          console.error("OAuth Error:", error.message);
          alert(`ไม่สามารถเข้าสู่ระบบด้วย Google ได้: ${error.message} \n(กรุณาเช็กการตั้งค่า Google Provider ใน Supabase)`);
        }
      } catch (err: any) {
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
      }
    } else {
      loginAsStudent();
      // Navigate manually for fallback mode since we removed router.push from the button
      window.location.href = '/student';
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
