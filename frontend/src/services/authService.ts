import { User, AuthResponse, UserRole } from '../types';

const STORAGE_KEY = 'mrt_auth';
const USERS_KEY = 'mrt_users';

// Initialize default users for demo
const initializeDefaultUsers = () => {
  const existingUsers = getUsers();
  
  // Check if default users already exist
  const hasAdmin = existingUsers.some(u => u.email === 'admin@example.com' && u.role === 'admin');
  const hasManager = existingUsers.some(u => u.email === 'manager@example.com' && u.role === 'manager');
  const hasTechnician = existingUsers.some(u => u.email === 'technician@example.com' && u.role === 'technician');
  
  // Only add missing default users
  const defaultUsers: User[] = [];
  
  if (!hasAdmin) {
    defaultUsers.push({
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      password: 'admin123',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    });
  }
  
  if (!hasManager) {
    defaultUsers.push({
      id: '2',
      email: 'manager@example.com',
      name: 'Manager User',
      role: 'manager',
      password: 'manager123',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    });
  }
  
  if (!hasTechnician) {
    defaultUsers.push({
      id: '3',
      email: 'technician@example.com',
      name: 'Technician User',
      role: 'technician',
      password: 'tech123',
      preferences: {
        theme: 'light',
        notifications: true,
      },
    });
  }
  
  if (defaultUsers.length > 0) {
    const allUsers = [...existingUsers, ...defaultUsers];
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  }
};

const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const authService = {
  login: (email: string, password: string, role: UserRole): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      try {
        initializeDefaultUsers();
        const users = getUsers();
        
        // Debug: Log users for troubleshooting
        console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
        console.log('Login attempt:', { email, role, passwordLength: password.length });
        
        // Find user by email and role (case-insensitive email)
        const user = users.find(u => 
          u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
          u.role === role
        );
        
        if (!user) {
          console.error('User not found. Available users:', users);
          setTimeout(() => reject(new Error('Invalid email or role. Please check your credentials.')), 500);
          return;
        }
        
        // For demo: accept password if it matches or if user has no password set
        if (!user.password || user.password === password) {
          const token = `token_${Date.now()}`;
          const { password: _, ...userWithoutPassword } = user;
          const authData: AuthResponse = {
            user: userWithoutPassword,
            token,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
          setTimeout(() => resolve(authData), 500); // Simulate API delay
        } else {
          setTimeout(() => reject(new Error('Invalid password')), 500);
        }
      } catch (error) {
        console.error('Login error:', error);
        setTimeout(() => reject(new Error('Login failed. Please try again.')), 500);
      }
    });
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const authData = localStorage.getItem(STORAGE_KEY);
    if (authData) {
      const parsed: AuthResponse = JSON.parse(authData);
      return parsed.user;
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  getToken: (): string | null => {
    const authData = localStorage.getItem(STORAGE_KEY);
    if (authData) {
      const parsed: AuthResponse = JSON.parse(authData);
      return parsed.token;
    }
    return null;
  },

  getAllUsers: (): User[] => {
    initializeDefaultUsers();
    return getUsers().map(({ password, ...user }) => user);
  },

  createUser: (userData: Omit<User, 'id'>): User => {
    const users = getUsers();
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser: (id: string, updates: Partial<User>): User | null => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updates,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const { password, ...userWithoutPassword } = users[index];
      return userWithoutPassword;
    }
    return null;
  },

  deleteUser: (id: string): boolean => {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    return filtered.length < users.length;
  },

  updatePassword: (userId: string, newPassword: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.password = newPassword;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },
};

