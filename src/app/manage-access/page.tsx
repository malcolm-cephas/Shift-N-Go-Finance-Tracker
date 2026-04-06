'use client';

import { useState, useEffect } from 'react';
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
    } catch (_error) {
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
    } catch (_error) {
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
    } catch (_error) {
      alert('Failed to revoke access');
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl p-8 border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl">🔐</div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Access Management</h1>
              <p className="text-neutral-500 font-medium">Manage dealership roles and permissions</p>
            </div>
          </div>

          {/* Add User Form */}
          <section className="mb-12 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider">Grant Access</h2>
            <form onSubmit={handleAddUser} className="grid md:grid-cols-4 gap-4">
              <input
                type="email"
                placeholder="Gmail Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="md:col-span-2 px-4 py-3 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="px-4 py-3 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-brand-red outline-none font-bold text-sm"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="INVESTOR">INVESTOR</option>
              </select>
              <button
                type="submit"
                className="bg-brand-red hover:bg-brand-red-dark text-white font-black rounded-xl py-3 shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-[0.98]"
              >
                GRANT
              </button>
            </form>
            {status && (
              <p className={`mt-4 text-sm font-bold ${status.type === 'success' ? 'text-green-600' : 'text-brand-red'}`}>
                {status.message}
              </p>
            )}
          </section>

          {/* Users Table */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-4 uppercase tracking-wider">Current Access List</h2>
            {isLoading ? (
              <div className="py-8 text-center text-neutral-400 font-bold animate-pulse">Scanning database...</div>
            ) : (
              <div className="overflow-hidden border dark:border-neutral-700 rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 text-xs font-black text-neutral-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">User Email</th>
                      <th className="px-6 py-4 text-center">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-neutral-700">
                    {users.map((u) => (
                      <tr key={u.email} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-neutral-200">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                            'bg-neutral-100 text-neutral-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRevoke(u.email)}
                            className="text-xs font-bold text-neutral-400 hover:text-brand-red transition-colors"
                          >
                            REVOKE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
