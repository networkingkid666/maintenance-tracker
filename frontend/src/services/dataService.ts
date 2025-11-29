import { Issue, Report, User, IssueCategory } from '../types';

const ISSUES_KEY = 'mrt_issues';
const REPORTS_KEY = 'mrt_reports';

// Initialize sample data
const initializeSampleData = () => {
  if (!localStorage.getItem(ISSUES_KEY)) {
    const sampleIssues: Issue[] = [
      {
        id: '1',
        title: 'HVAC System Maintenance',
        description: 'Regular maintenance check for HVAC system',
        category: 'A/C',
        status: 'pending',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '1',
      },
      {
        id: '2',
        title: 'Elevator Door Repair',
        description: 'Elevator door not closing properly',
        category: 'Machine Repair',
        status: 'solved',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: '1',
      },
      {
        id: '3',
        title: 'Plumbing Leak Fix',
        description: 'Water leak in restroom on 3rd floor',
        category: 'Plumbing',
        status: 'pending',
        priority: 'high',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        createdBy: '1',
      },
    ];
    localStorage.setItem(ISSUES_KEY, JSON.stringify(sampleIssues));
  }

  if (!localStorage.getItem(REPORTS_KEY)) {
    const sampleReports: Report[] = [
      {
        id: '1',
        title: 'Monthly Maintenance Report',
        description: 'Summary of all maintenance activities for the month',
        type: 'maintenance',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '1',
      },
      {
        id: '2',
        title: 'Equipment Inspection Report',
        description: 'Quarterly inspection of all equipment',
        type: 'inspection',
        date: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        createdBy: '1',
      },
    ];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(sampleReports));
  }
};

export const dataService = {
  // Issues
  getIssues: (): Issue[] => {
    initializeSampleData();
    const issues = localStorage.getItem(ISSUES_KEY);
    return issues ? JSON.parse(issues) : [];
  },

  getIssue: (id: string): Issue | null => {
    const issues = dataService.getIssues();
    return issues.find(i => i.id === id) || null;
  },

  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Issue => {
    const issues = dataService.getIssues();
    const newIssue: Issue = {
      ...issue,
      id: `issue_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    issues.push(newIssue);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
    return newIssue;
  },

  updateIssue: (id: string, updates: Partial<Issue>): Issue | null => {
    const issues = dataService.getIssues();
    const index = issues.findIndex(i => i.id === id);
    if (index !== -1) {
      issues[index] = {
        ...issues[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
      return issues[index];
    }
    return null;
  },

  deleteIssue: (id: string): boolean => {
    const issues = dataService.getIssues();
    const filtered = issues.filter(i => i.id !== id);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(filtered));
    return filtered.length < issues.length;
  },

  // Reports
  getReports: (): Report[] => {
    initializeSampleData();
    const reports = localStorage.getItem(REPORTS_KEY);
    return reports ? JSON.parse(reports) : [];
  },

  getReport: (id: string): Report | null => {
    const reports = dataService.getReports();
    return reports.find(r => r.id === id) || null;
  },

  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Report => {
    const reports = dataService.getReports();
    const newReport: Report = {
      ...report,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reports.push(newReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return newReport;
  },

  updateReport: (id: string, updates: Partial<Report>): Report | null => {
    const reports = dataService.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = {
        ...reports[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      return reports[index];
    }
    return null;
  },

  deleteReport: (id: string): boolean => {
    const reports = dataService.getReports();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
    return filtered.length < reports.length;
  },

  // Monthly Reports
  getMonthlyReports: () => {
    const issues = dataService.getIssues();
    const monthlyData: { [key: string]: { total: number; pending: number; solved: number } } = {};
    
    issues.forEach(issue => {
      const date = new Date(issue.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, pending: 0, solved: 0 };
      }
      
      monthlyData[monthKey].total++;
      if (issue.status === 'pending') {
        monthlyData[monthKey].pending++;
      } else {
        monthlyData[monthKey].solved++;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  },
};

