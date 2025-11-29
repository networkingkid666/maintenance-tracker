import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import StatsTabs from '../components/Dashboard/StatsTabs';
import PieChart from '../components/Dashboard/PieChart';
import { dataService } from '../services/dataService';
import { Issue } from '../types';
import { useSidebar } from '../hooks/useSidebar';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Dashboard() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [activeTab, setActiveTab] = useState<'total' | 'pending' | 'solved'>('total');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIssues(dataService.getIssues());
  }, []);

  const filteredIssues =
    activeTab === 'total'
      ? issues.filter(i => 
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : activeTab === 'pending'
      ? issues.filter(i => 
          i.status === 'pending' &&
          (i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           i.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : issues.filter(i => 
          i.status === 'solved' &&
          (i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           i.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  const recentlyAddedIssues = [...issues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <Header onSearch={setSearchQuery} />

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
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-gray-800 mb-8"
          >
            Dashboard
          </motion.h1>

          <StatsTabs
            issues={issues}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PieChart issues={issues} />

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Recently Added Issues
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentlyAddedIssues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No issues found</p>
                ) : (
                  recentlyAddedIssues.map((issue) => (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{issue.title}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            issue.status === 'solved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Priority: {issue.priority}</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}

