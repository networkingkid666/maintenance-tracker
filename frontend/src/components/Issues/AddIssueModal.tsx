import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Issue, IssueCategory, User } from '../../types';
import { authService } from '../../services/authService';

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  editingIssue?: Issue | null;
}

export default function AddIssueModal({ isOpen, onClose, onSubmit, editingIssue }: AddIssueModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing' as IssueCategory,
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'solved',
    assignedTo: '',
  });
  const [technicians, setTechnicians] = useState<User[]>([]);

  // Load technicians when modal opens
  useEffect(() => {
    if (isOpen) {
      const allUsers = authService.getAllUsers();
      const techUsers = allUsers.filter(user => user.role === 'technician');
      setTechnicians(techUsers);
    }
  }, [isOpen]);

  // Update form data when editingIssue changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingIssue) {
        setFormData({
          title: editingIssue.title || '',
          description: editingIssue.description || '',
          category: editingIssue.category || 'Plumbing',
          priority: editingIssue.priority || 'medium',
          status: editingIssue.status || 'pending',
          assignedTo: editingIssue.assignedTo || '',
        });
      } else {
        // Reset form for new issue
        setFormData({
          title: '',
          description: '',
          category: 'Plumbing',
          priority: 'medium',
          status: 'pending',
          assignedTo: '',
        });
      }
    }
  }, [editingIssue, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      assignedTo: formData.assignedTo || undefined,
    };
    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingIssue ? 'Edit Issue' : 'Add New Issue'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as IssueCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electric">Electric</option>
                <option value="A/C">A/C</option>
                <option value="IT">IT</option>
                <option value="Machine Repair">Machine Repair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'solved' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
              >
                <option value="pending">Pending</option>
                <option value="solved">Solved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Technician
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
              >
                <option value="">Select Technician (Optional)</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
            >
              {editingIssue ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

