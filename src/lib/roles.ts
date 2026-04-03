export type UserRole = 'ADMIN' | 'MANAGER' | 'INVESTOR' | 'UNAUTHORIZED';

// Define typed user structure loosely for email access
interface UserWithEmail {
  email?: string | null;
  [key: string]: unknown;
}

// In a real application, these might come from a database or Auth0 metadata
// For this application, we'll use environment variables or a hardcoded list for simplicity
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
const MANAGER_EMAILS = (process.env.NEXT_PUBLIC_MANAGER_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
const INVESTOR_EMAILS = (process.env.NEXT_PUBLIC_INVESTOR_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export function getUserRole(user: UserWithEmail | null | undefined): UserRole {
  if (!user || !user.email) return 'UNAUTHORIZED';
  
  const email = user.email.toLowerCase();
  
  if (ADMIN_EMAILS.includes(email)) return 'ADMIN';
  if (MANAGER_EMAILS.includes(email)) return 'MANAGER';
  if (INVESTOR_EMAILS.includes(email)) return 'INVESTOR';
  
  // Default to UNAUTHORIZED if not in any list, unless we want a default role
  // For a private tracker, we probably want to be strict.
  return 'UNAUTHORIZED';
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VIEW_SETTINGS', 'VIEW_ANALYTICS', 'VIEW_ALL'],
  MANAGER: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VIEW_SETTINGS', 'VIEW_ANALYTICS'],
  INVESTOR: ['READ', 'VIEW_ANALYTICS'],
  UNAUTHORIZED: [],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission) || ROLE_PERMISSIONS[role].includes('VIEW_ALL');
}
