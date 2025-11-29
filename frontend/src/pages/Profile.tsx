import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import BackButton from '../components/BackButton';
import CreateUserModal from '../components/Users/CreateUserModal';
import ChangePasswordModal from '../components/Profile/ChangePasswordModal';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';
import { hasPermission } from '../utils/rolePermissions';
import { useSidebar } from '../hooks/useSidebar';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Profile() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const isTechnician = currentUser?.role === 'technician';

  useEffect(() => {
    loadUser();
    if (isAdmin) {
      loadUsers();
    }
  }, []);

  const loadUser = () => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  };

  const loadUsers = () => {
    setUsers(authService.getAllUsers());
  };

  const handleCreateUser = (userData: any) => {
    if (editingUser) {
      const updates: any = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
      };
      if (userData.password) {
        updates.password = userData.password;
      }
      authService.updateUser(editingUser.id, updates);
    } else {
      authService.createUser({
        ...userData,
        password: userData.password,
      });
    }
    loadUsers();
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handlePasswordChange = (newPassword: string, confirmPassword: string) => {
    if (currentUser) {
      authService.updatePassword(currentUser.id, newPassword);
      alert('Password updated successfully');
      setIsPasswordModalOpen(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isDesktop ? (isOpen ? '256px' : '80px') : '0px'
        }}
        transition={{ duration: 0.3 }}
        className="pt-24 p-8"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <BackButton />
          {/* Admin: Admin Profile First */}
          {isAdmin && (
            <>
              {/* Admin Profile Edit */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h2>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-24 h-24 bg-mid-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-mid-blue capitalize">{user.role}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
                >
                  Change Password
                </motion.button>
              </div>

              {/* User Management */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingUser(null);
                      setIsUserModalOpen(true);
                    }}
                    className="bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
                  >
                    Create New User
                  </motion.button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded bg-mid-blue text-white capitalize">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setIsUserModalOpen(true);
                              }}
                              className="text-mid-blue hover:text-mid-blue-dark"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Manager: Password Reset Only */}
          {isManager && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Manager Profile</h2>
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 bg-mid-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
              >
                Reset Password
              </motion.button>
            </div>
          )}

          {/* Technician: View Only */}
          {isTechnician && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-mid-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-mid-blue capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.main>

      <CreateUserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateUser}
        editingUser={editingUser}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
}
