import { motion } from 'framer-motion';
import { Issue } from '../../types';

interface StatsTabsProps {
  issues: Issue[];
  activeTab: 'total' | 'pending' | 'solved';
  onTabChange: (tab: 'total' | 'pending' | 'solved') => void;
}

export default function StatsTabs({ issues, activeTab, onTabChange }: StatsTabsProps) {
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const solvedIssues = issues.filter(i => i.status === 'solved').length;

  const tabs = [
    { id: 'total' as const, label: 'Total Issues', count: totalIssues, color: 'bg-mid-blue' },
    { id: 'pending' as const, label: 'Pending Issues', count: pendingIssues, color: 'bg-orange-500' },
    { id: 'solved' as const, label: 'Solved Issues', count: solvedIssues, color: 'bg-green-500' },
  ];

  return (
    <div className="flex space-x-4 mb-8">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 p-6 rounded-xl shadow-lg transition-all ${
            activeTab === tab.id
              ? `${tab.color} text-white`
              : 'bg-white text-gray-700 hover:shadow-xl'
          }`}
        >
          <div className="text-center">
            <motion.div
              key={tab.count}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-4xl font-bold mb-2"
            >
              {tab.count}
            </motion.div>
            <div className="text-sm font-medium opacity-90">{tab.label}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

