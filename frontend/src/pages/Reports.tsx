import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import BackButton from '../components/BackButton';
import { dataService } from '../services/dataService';
import { exportToCSV } from '../utils/csvExport';
import { Issue } from '../types';
import { useSidebar } from '../hooks/useSidebar';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Reports() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [issues, setIssues] = useState<Issue[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIssues(dataService.getIssues());
    setMonthlyReports(dataService.getMonthlyReports());
  };

  const handleExportAll = () => {
    exportToCSV(issues, `all-issues-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPending = () => {
    const pending = issues.filter(i => i.status === 'pending');
    exportToCSV(pending, `pending-issues-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportSolved = () => {
    const solved = issues.filter(i => i.status === 'solved');
    exportToCSV(solved, `solved-issues-${new Date().toISOString().split('T')[0]}.csv`);
  };

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
        <div className="max-w-7xl mx-auto">
          <BackButton />
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportAll}
                className="bg-mid-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-mid-blue-dark transition-colors"
              >
                Download All Issues
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPending}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Download Pending
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportSolved}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Download Solved
              </motion.button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Reports</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Issues
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No reports available
                      </td>
                    </tr>
                  ) : (
                    monthlyReports.map((report) => (
                      <tr key={report.month} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(report.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                          {report.pending}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {report.solved}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
