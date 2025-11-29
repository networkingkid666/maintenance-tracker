import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import BackButton from '../components/BackButton';
import AddIssueModal from '../components/Issues/AddIssueModal';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { hasPermission } from '../utils/rolePermissions';
import { Issue, User } from '../types';
import { useSidebar } from '../hooks/useSidebar';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Issues() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'solved'>('all');
  const user = authService.getCurrentUser();
  const canCreate = hasPermission(user?.role || 'technician', 'canCreateIssues');
  const canEdit = hasPermission(user?.role || 'technician', 'canEditIssues');
  const canDelete = hasPermission(user?.role || 'technician', 'canDeleteIssues');

  useEffect(() => {
    loadIssues();
    setUsers(authService.getAllUsers());
  }, []);

  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return 'Unassigned';
    const technician = users.find(u => u.id === technicianId);
    return technician ? technician.name : 'Unknown';
  };

  const loadIssues = () => {
    setIssues(dataService.getIssues());
  };

  const handleOpenModal = (issue?: Issue) => {
    if (issue) {
      setEditingIssue(issue);
    } else {
      setEditingIssue(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  const handleSubmit = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (editingIssue) {
      dataService.updateIssue(editingIssue.id, issueData);
    } else {
      dataService.createIssue({
        ...issueData,
        createdBy: user?.id || '1',
      });
    }
    loadIssues();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      dataService.deleteIssue(id);
      loadIssues();
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <Header onSearch={setSearchTerm} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginLeft: isDesktop ? (isOpen ? '256px' : '80px') : '0px'
        }}
        transition={{ duration: 0.3 }}
        className="pt-24 p-8"
      >
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Issues</h1>
            {canCreate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenModal()}
                className="bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
              >
                Add New Issue
              </motion.button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'solved')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
              >
                <option value="all">All Issues</option>
                <option value="pending">Pending Issues</option>
                <option value="solved">Solved Issues</option>
              </select>
            </div>
          </div>

          {/* List Style Issues */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    {(canEdit || canDelete) && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredIssues.length === 0 ? (
                      <tr>
                        <td colSpan={canEdit || canDelete ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                          No issues found
                        </td>
                      </tr>
                    ) : (
                      filteredIssues.map((issue) => (
                        <motion.tr
                          key={issue.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{issue.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{issue.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(issue.priority)}`}>
                              {issue.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                issue.status === 'solved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {getTechnicianName(issue.assignedTo)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </td>
                          {(canEdit || canDelete) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {canEdit && (
                                  <button
                                    onClick={() => handleOpenModal(issue)}
                                    className="text-mid-blue hover:text-mid-blue-dark"
                                  >
                                    Edit
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={() => handleDelete(issue.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.main>

      <AddIssueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingIssue={editingIssue}
      />
    </div>
  );
}
