export type UserRole = 'admin' | 'manager' | 'technician';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  avatar?: string;
  password?: string; // For demo purposes
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
}

export type IssueCategory = 'Plumbing' | 'Electric' | 'A/C' | 'IT' | 'Machine Repair';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: 'pending' | 'solved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // Technician user ID
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'maintenance' | 'repair' | 'inspection' | 'other';
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

