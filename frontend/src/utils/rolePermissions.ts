import { UserRole } from '../types';

export const rolePermissions = {
  admin: {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canCreateIssues: true,
    canEditIssues: true,
    canDeleteIssues: true,
    canViewReports: true,
    canExportReports: true,
    canViewAllIssues: true,
    canAssignIssues: true,
  },
  manager: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateIssues: true,
    canEditIssues: true,
    canDeleteIssues: true,
    canViewReports: true,
    canExportReports: true,
    canViewAllIssues: true,
    canAssignIssues: true,
  },
  technician: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateIssues: false,
    canEditIssues: false,
    canDeleteIssues: false,
    canViewReports: false,
    canExportReports: false,
    canViewAllIssues: true,
    canAssignIssues: false,
  },
};

export const hasPermission = (role: UserRole, permission: keyof typeof rolePermissions.admin): boolean => {
  return rolePermissions[role]?.[permission] ?? false;
};

