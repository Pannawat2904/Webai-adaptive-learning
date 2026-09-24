'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserRole, Profile } from '@/types/database';
import { MOCK_PROFILES } from '@/lib/mock-data';
import { Users, Shield, UserCheck, Search, ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
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
  
  // Custom Users State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('teacher');
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    // Load custom users from local storage
    try {
      const customUsersStr = localStorage.getItem('webai_custom_users');
      if (customUsersStr) {
        const customUsers = JSON.parse(customUsersStr);
        // Map custom users to Profile type for display
        const customProfiles = customUsers.map((cu: any) => ({
          id: cu.id,
          role: cu.role,
          full_name: cu.full_name || cu.username,
          email: cu.username, // Using username as email column
          created_at: new Date().toISOString()
        }));
        setUsersList(prev => [...prev, ...customProfiles]);
      }
    } catch(e) {}
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const newUser = {
      id: 'custom-' + Date.now(),
      username: newUsername,
      password: newPassword,
      full_name: newFullName,
      role: newRole
    };

    try {
      // Save to localStorage
      const existingStr = localStorage.getItem('webai_custom_users');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [...existing, newUser];
      localStorage.setItem('webai_custom_users', JSON.stringify(updated));

      // Update UI
      setUsersList(prev => [...prev, {
        id: newUser.id,
        role: newUser.role,
        full_name: newUser.full_name || newUser.username,
        email: newUser.username,
        created_at: new Date().toISOString()
      }]);

      // Reset form
      setNewUsername('');
      setNewPassword('');
      setNewFullName('');
      setShowAddForm(false);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
      
      auditLog('create_custom_user', 'users', { username: newUser.username, role: newUser.role });
    } catch (e) {
      console.error(e);
    }
  };

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

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อหรืออีเมล..."
                className="pl-9 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 w-full backdrop-blur-md"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">เพิ่มผู้สอน</span>
            </button>
          </div>
        </div>
      </div>

      {isSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>สร้างบัญชีผู้ใช้งานใหม่เรียบร้อยแล้ว</span>
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2 mb-4">
            <UserCheck className="w-4 h-4 text-purple-500" />
            สร้างบัญชีผู้ใช้งานสำหรับครู/ผู้ดูแล
          </h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Username (ชื่อผู้ใช้)</label>
              <input type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="เช่น teacher_jane" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Password (รหัสผ่าน)</label>
              <input type="text" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="รหัสผ่านเข้าสู่ระบบ" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">ชื่อ - นามสกุล (แสดงผล)</label>
              <input type="text" required value={newFullName} onChange={e => setNewFullName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" placeholder="ชื่อ นามสกุล" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">สิทธิ์การใช้งาน (Role)</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <option value="teacher">ครูผู้สอน (Teacher)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                ยกเลิก
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all">
                บันทึกบัญชีผู้ใช้งาน
              </button>
            </div>
          </form>
        </div>
      )}

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
