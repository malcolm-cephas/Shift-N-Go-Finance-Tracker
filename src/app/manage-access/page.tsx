'use client';

import { useState, useEffect, useMemo } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/lib/roles';

interface AuthorizedUser {
  email: string;
  role: UserRole;
  name?: string;
  addedAt: string;
}

export default function ManageAccessPage() {
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('INVESTOR');
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, role: newRole, name: newName }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'User access granted successfully' });
        setNewEmail('');
        setNewName('');
        fetchUsers();
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || 'Failed to add user' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error' });
    }
  }

  async function handleRevoke(email: string) {
    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) return;

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch {
      alert('Failed to revoke access');
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilters, setRoleFilters] = useState<UserRole[]>(['ADMIN', 'MANAGER', 'INVESTOR']);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectConfirmation, setRejectConfirmation] = useState<{ email: string; input: string } | null>(null);

  const toggleRoleFilter = (role: UserRole) => {
    setRoleFilters(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    setCurrentPage(1);
  };

  async function handleApprove(email: string, role: UserRole, name?: string) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, name }),
      });
      if (res.ok) {
        setStatus({ type: 'success', message: name ? `Nickname updated for ${email}` : `Access approved for ${email} as ${role}` });
        fetchUsers();
      }
    } catch {
      setStatus({ type: 'error', message: 'Failed to update user' });
    }
  }

  async function handleReject(email: string) {
    if (rejectConfirmation?.input.toUpperCase() !== 'REJECT') return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'REJECTED' }),
      });
      if (res.ok) {
        setRejectConfirmation(null);
        fetchUsers();
      }
    } catch {
      alert('Failed to reject access');
    }
  }

  const pendingRequests = users.filter(u => u.role === 'PENDING');
  
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => u.role !== 'PENDING' && u.role !== 'REJECTED')
      .filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilters.includes(u.role);
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }, [users, searchTerm, roleFilters]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
        <div className="bg-white dark:bg-neutral-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="text-5xl drop-shadow-lg">🔐</div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Access Command</h1>
                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-1">Founders Exclusive Entry Management</p>
              </div>
            </div>
            {status && (
              <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                {status.message}
              </div>
            )}
          </div>

          {/* NOTIFICATION: Pending Access Requests */}
          {pendingRequests.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-red"></span>
                </span>
                <h2 className="text-sm font-black text-brand-red uppercase tracking-[0.2em]">Pending Access Notifications ({pendingRequests.length})</h2>
              </div>
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req.email} className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 p-6 rounded-3xl flex flex-col items-center gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                      <div className="flex items-center gap-4 text-left w-full">
                        <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-xl shadow-sm border border-red-100 dark:border-red-900/30">👤</div>
                        <div>
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">New Connection Attempt</p>
                          <p className="text-lg font-black text-gray-900 dark:text-gray-100">{req.email}</p>
                          {req.name && <p className="text-xs font-bold text-gray-500 italic mt-1">Requested Name: {req.name}</p>}
                        </div>
                      </div>
                      
                      {rejectConfirmation?.email === req.email ? (
                        <div className="flex items-center gap-3 w-full md:w-auto bg-white dark:bg-neutral-800 p-2 rounded-2xl border-2 border-red-500 shadow-lg">
                          <input 
                            type="text" 
                            placeholder="Type REJECT to confirm" 
                            autoFocus
                            value={rejectConfirmation?.input || ''}
                            onChange={(e) => setRejectConfirmation(prev => prev ? { ...prev, input: e.target.value } : null)}
                            className="bg-transparent text-xs font-black uppercase tracking-widest outline-none px-4 py-2 w-full md:w-48"
                          />
                          <button 
                            onClick={() => handleReject(req.email)}
                            disabled={rejectConfirmation?.input.toUpperCase() !== 'REJECT'}
                            className="bg-red-600 disabled:bg-neutral-300 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                          >
                            CONFIRM
                          </button>
                          <button 
                            onClick={() => setRejectConfirmation(null)}
                            className="text-neutral-400 hover:text-gray-900 px-2 text-[10px] font-black"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <div className="flex-1 md:flex-none">
                            <select 
                              id={`role-select-${req.email}`}
                              className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-red-200 dark:border-red-900/50 rounded-2xl text-xs font-black uppercase focus:ring-2 focus:ring-brand-red outline-none"
                            >
                              <option value="INVESTOR">INVESTOR</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => {
                              const select = document.getElementById(`role-select-${req.email}`) as HTMLSelectElement;
                              handleApprove(req.email, select.value as UserRole);
                            }}
                            className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-200 dark:shadow-none"
                          >
                            APPROVE
                          </button>
                          <button 
                            onClick={() => setRejectConfirmation({ email: req.email, input: '' })}
                            className="text-xs font-black text-neutral-400 hover:text-brand-red px-2"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Add User Form (Classic Whitelist) */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Manual Whitelist Grant</h2>
            </div>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-[2rem] border border-neutral-100 dark:border-neutral-800">
              <input
                type="email"
                placeholder="Direct Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="md:col-span-1 px-6 py-4 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-medium"
              />
              <input
                type="text"
                placeholder="Enter Nickname"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="md:col-span-1 px-6 py-4 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-medium"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="px-6 py-4 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none font-black text-xs appearance-none"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="INVESTOR">INVESTOR</option>
              </select>
              <button
                type="submit"
                className="md:col-span-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black rounded-2xl py-4 shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                GRANT ACCESS
              </button>
            </form>
          </section>

          {/* Personnel Filter Bar */}
          <section className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search Personnel Email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-red transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 px-4 rounded-2xl border dark:border-neutral-700 h-[46px]">
                    <span className="text-[10px] font-black text-neutral-400 uppercase">Per Page:</span>
                    {[10, 15, 20].map(n => (
                        <button 
                            key={n}
                            onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                            className={`text-[10px] font-black ${itemsPerPage === n ? 'text-brand-red underline underline-offset-4' : 'text-neutral-300 hover:text-gray-900'}`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 border-t dark:border-neutral-800 pt-4 border-dashed">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Filter Clearance:</span>
                {(['ADMIN', 'MANAGER', 'INVESTOR'] as UserRole[]).map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={roleFilters.includes(r)}
                            onChange={() => toggleRoleFilter(r)}
                            className="hidden"
                        />
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            roleFilters.includes(r) 
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white' 
                            : 'bg-white dark:bg-neutral-800 text-neutral-400 border-neutral-100 dark:border-neutral-700 group-hover:border-neutral-300'
                        }`}>
                            {r}
                        </div>
                    </label>
                ))}
            </div>
          </section>

          {/* Users Table */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Authorized Access List ({filteredUsers.length})</h2>
            </div>
            {isLoading ? (
              <div className="py-20 text-center text-neutral-300 font-black animate-pulse uppercase tracking-[0.5em]">Scanning Security Clearing...</div>
            ) : (
              <div className="overflow-hidden border dark:border-neutral-800 rounded-[2rem]">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b dark:border-neutral-800">
                    <tr>
                      <th className="px-8 py-5">Corporate Identity</th>
                      <th className="px-8 py-5 text-center">Clearance Level</th>
                      <th className="px-8 py-5 text-right w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-neutral-800">
                    {paginatedUsers.map((u) => (
                      <tr key={u.email} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            {u.name ? (
                              <span className="font-black text-gray-900 dark:text-white text-lg leading-tight">{u.name}</span>
                            ) : (
                              <span className="font-black text-gray-400 italic text-sm italic">No Nickname Set</span>
                            )}
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700 border border-red-200 shadow-sm shadow-red-100' :
                            u.role === 'MANAGER' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                            'bg-neutral-100 text-neutral-700 border'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => {
                                const newNick = prompt('Enter new nickname for ' + u.email, u.name || '');
                                if (newNick !== null) {
                                  handleApprove(u.email, u.role, newNick);
                                }
                              }}
                              className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest"
                            >
                              EDIT NICKNAME
                            </button>
                            <button
                              onClick={() => handleRevoke(u.email)}
                              className="text-[10px] font-black text-neutral-300 hover:text-brand-red transition-colors uppercase tracking-widest"
                            >
                              REVOKE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-20 text-center text-neutral-400 font-bold italic">No matching authorized personnel detected.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8 px-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 shadow-sm hover:shadow-md"
                        >
                            PREV
                        </button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 shadow-sm hover:shadow-md"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
