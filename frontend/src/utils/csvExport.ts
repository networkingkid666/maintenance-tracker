import { Issue } from '../types';

export const exportToCSV = (issues: Issue[], filename: string) => {
  const headers = ['ID', 'Title', 'Description', 'Category', 'Status', 'Priority', 'Created At', 'Updated At'];
  
  const csvContent = [
    headers.join(','),
    ...issues.map(issue => [
      issue.id,
      `"${issue.title.replace(/"/g, '""')}"`,
      `"${issue.description.replace(/"/g, '""')}"`,
      issue.category,
      issue.status,
      issue.priority,
      new Date(issue.createdAt).toLocaleString(),
      new Date(issue.updatedAt).toLocaleString(),
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

