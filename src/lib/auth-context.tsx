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
  switchRole: (role: UserRole) => void;
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

  useEffect(() => {
    // Check localStorage for saved demo role
    const savedRole = localStorage.getItem('webai_demo_role') as UserRole;
    if (savedRole && MOCK_PROFILES[savedRole]) {
      setRole(savedRole);
      setProfile(MOCK_PROFILES[savedRole]);
    }

    const supabase = createClient();
    if (supabase) {
      setIsLiveSupabase(true);
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          // Fetch profile from supabase
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

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (MOCK_PROFILES[newRole]) {
      setProfile(MOCK_PROFILES[newRole]);
      localStorage.setItem('webai_demo_role', newRole);
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
      // Demo mode fallback notification
      alert('ขณะนี้อยู่ในโหมดจำลอง (Development/Demo Mode) เนื่องจากยังไม่ได้ตั้งค่า Supabase URL ใน .env.local คุณสามารถสลับบทบาทเป็น นักเรียน, ครู หรือ แอดมิน ได้ทันทีที่แถบควบคุมด้านบน');
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setProfile(MOCK_PROFILES.student);
    setRole('student');
    localStorage.removeItem('webai_demo_role');
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
      // Keep last 100
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
        switchRole,
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
