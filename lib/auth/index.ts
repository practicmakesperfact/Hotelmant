import type { User, UserRole, AuthToken } from '@/lib/types';
import { mockUsers, getUserByEmail } from '@/lib/mock-data';

// Simple hash function for demo (in production, use bcrypt)
export function simpleHash(password: string): string {
  // This is NOT secure - just for demo purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hashed_${Math.abs(hash).toString(16)}`;
}

// Demo passwords (all users use these in mock mode)
export const DEMO_PASSWORDS: Record<string, string> = {
  'admin@leulmekonenhotel.com': 'admin123',
  'manager@leulmekonenhotel.com': 'manager123',
  'reception@leulmekonenhotel.com': 'reception123',
  'housekeeping@leulmekonenhotel.com': 'housekeeping123',
  'inventory@leulmekonenhotel.com': 'inventory123',
  'customer@example.com': 'customer123',
};

// Generate JWT-like token (simplified for demo)
export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  // In production, use proper JWT library
  return btoa(JSON.stringify(payload));
}

// Verify and decode token
export function verifyToken(token: string): AuthToken | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    return {
      token,
      userId: payload.userId,
      role: payload.role,
      expiresAt: new Date(payload.exp),
    };
  } catch {
    return null;
  }
}

// Login function
export function login(email: string, password: string): { success: boolean; token?: string; user?: User; error?: string } {
  const user = getUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!user.isActive) {
    return { success: false, error: 'Account is disabled' };
  }

  // Check password (demo mode)
  const expectedPassword = DEMO_PASSWORDS[email];
  if (!expectedPassword || password !== expectedPassword) {
    return { success: false, error: 'Invalid password' };
  }

  const token = generateToken(user);
  return { success: true, token, user };
}

// Mock registration (saves to localStorage for demo persistence)
export function register(userData: any): { success: boolean; error?: string } {
  try {
    const existingUsers = JSON.parse(localStorage.getItem('habesha_hotel_users') || '[]');
    
    if (existingUsers.some((u: any) => u.email === userData.email) || getUserByEmail(userData.email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    existingUsers.push(newUser);
    localStorage.setItem('habesha_hotel_users', JSON.stringify(existingUsers));
    
    // Also save password for login mock
    const passwords = JSON.parse(localStorage.getItem('habesha_hotel_passwords') || '{}');
    passwords[userData.email] = userData.password;
    localStorage.setItem('habesha_hotel_passwords', JSON.stringify(passwords));

    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to register' };
  }
}

// Permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['all', 'users', 'rooms', 'bookings', 'reports', 'settings', 'inventory', 'services', 'housekeeping'],
  manager: ['reports', 'rooms', 'bookings', 'services', 'inventory', 'housekeeping', 'staff-view'],
  receptionist: ['bookings', 'check-in', 'check-out', 'guests', 'room-status'],
  housekeeping: ['room-status', 'tasks', 'maintenance', 'inventory-request'],
  inventory_manager: ['inventory', 'suppliers', 'orders', 'reports-inventory'],
  customer: ['my-bookings', 'profile', 'services', 'payments'],
};

// Check if user has permission
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes('all') || permissions.includes(permission);
}

// Get dashboard route for role
export function getDashboardRoute(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    admin: '/admin',
    manager: '/manager',
    receptionist: '/receptionist',
    housekeeping: '/housekeeping',
    inventory_manager: '/inventory',
    customer: '/customer',
  };
  return routes[role];
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager',
  receptionist: 'Receptionist',
  housekeeping: 'Housekeeping',
  inventory_manager: 'Inventory Manager',
  customer: 'Customer',
};
