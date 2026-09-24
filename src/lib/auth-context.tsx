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

      const syncUser = async (user: any) => {
        if (!user) return;
        const meta = user.user_metadata || {};
        const googleName = meta.full_name || meta.name || user.email?.split('@')[0] || 'นักเรียน';
        const googleAvatar = meta.avatar_url || meta.picture || '';

        localStorage.setItem('webai_demo_role', 'student');

        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (data) {
            setProfile({
              ...data,
              full_name: data.full_name || googleName,
              avatar_url: data.avatar_url || googleAvatar,
              email: data.email || user.email,
            });
            setRole(data.role || 'student');
          } else {
            const newProfile: Profile = {
              id: user.id,
              role: 'student',
              full_name: googleName,
              email: user.email,
              avatar_url: googleAvatar,
              created_at: new Date().toISOString(),
            };
            setProfile(newProfile);
            setRole('student');

            await supabase.from('profiles').upsert({
              id: user.id,
              role: 'student',
              full_name: googleName,
              avatar_url: googleAvatar,
              email: user.email,
            });
          }
        } catch {
          setProfile({
            id: user.id,
            role: 'student',
            full_name: googleName,
            email: user.email,
            avatar_url: googleAvatar,
            created_at: new Date().toISOString(),
          });
          setRole('student');
        }
      };

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          syncUser(user).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncUser(session.user);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
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
        localStorage.setItem('webai_demo_role', 'student');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/student/lessons`,
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
      alert("ระบบตรวจไม่พบ API Key ของ Supabase!\n\nสาเหตุที่เป็นไปได้:\n1. คุณยังไม่ได้ตั้งค่า Environment Variables ใน Vercel\n2. Vercel ยัง Build โปรเจกต์ไม่เสร็จ (ต้องรอประมาณ 2 นาที)\n\nระบบจึงไม่สามารถเปิดหน้าต่าง Google Login ได้ครับ");
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
