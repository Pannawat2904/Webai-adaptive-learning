'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserRole, Profile } from '@/types/database';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Users, Shield, UserCheck, Search, ArrowLeft } from 'lucide-react';
import { TeacherAdminGuard } from '@/components/auth/TeacherAdminGuard';

export default function AdminUsersPage() {
  const { auditLog } = useAuth();
  const [usersList, setUsersList] = useState<Profile[]>([
    MOCK_PROFILES.student,
    MOCK_PROFILES.teacher,
    MOCK_PROFILES.admin,
    {
      id: 's002-student-uuid',
      role: 'student',
      full_name: 'กานต์ดา มุ่งมั่นวิชา (ปวช.1)',
      email: 'kan-da.s@vec.mail.go.th',
      created_at: new Date().toISOString(),
    },
    {
      id: 's003-student-uuid',
      role: 'student',
      full_name: 'ธนกร เขียนโค้ดไว (ปวช.1)',
      email: 'thanakorn.c@vec.mail.go.th',
      created_at: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    auditLog('update_user_role', 'profiles', { userId, newRole });
  };

  const filtered = usersList.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <TeacherAdminGuard allowedRoles={['admin']}>
      <div className="space-y-6 pb-12">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับหน้าแรก</span>
      </Link>

      {/* Header in Liquid Glass */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              จัดการผู้ใช้งานและกำหนดสิทธิ์ (Admin)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              กำหนดบทบาทนักเรียน (Student), ครูผู้สอน (Teacher) และผู้ดูแลระบบ (Admin)
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมล..."
              className="pl-9 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 w-full sm:w-64 backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="liquid-glass rounded-3xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 font-bold">
                <th className="p-3.5">ผู้ใช้งาน</th>
                <th className="p-3.5">อีเมล</th>
                <th className="p-3.5">สิทธิ์ปัจจุบัน</th>
                <th className="p-3.5 text-right">เปลี่ยนสิทธิ์การใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-purple-500/5 transition-colors">
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {user.full_name.charAt(0)}
                      </div>
                      <span>{user.full_name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {user.email || '-'}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                        user.role === 'admin'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                          : user.role === 'teacher'
                          ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {user.role === 'admin' ? '🛡️ ผู้ดูแลระบบ (Admin)' : user.role === 'teacher' ? '👩‍🏫 ครูผู้สอน' : '👨‍🎓 นักเรียน ปวช.'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-2xs"
                    >
                      <option value="student">นักเรียน (Student)</option>
                      <option value="teacher">ครูผู้สอน (Teacher)</option>
                      <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </TeacherAdminGuard>
  );
}
