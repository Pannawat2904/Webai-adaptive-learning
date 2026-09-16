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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <Shield className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            จัดการผู้ใช้งานและกำหนดสิทธิ์ (Admin)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            กำหนดบทบาทนักเรียน (Student), ครูผู้สอน (Teacher) และผู้ดูแลระบบ (Admin)
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs w-64"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3 rounded-l-lg">ผู้ใช้งาน</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">สิทธิ์ปัจจุบัน</th>
                <th className="p-3 text-right rounded-r-lg">เปลี่ยนสิทธิ์การใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {user.full_name}
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                    {user.email || '-'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : user.role === 'teacher'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {user.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : user.role === 'teacher' ? 'ครูผู้สอน' : 'นักเรียน ปวช.'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                      className="text-xs p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
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
