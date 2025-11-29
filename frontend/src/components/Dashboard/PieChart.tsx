import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Issue } from '../../types';

interface PieChartProps {
  issues: Issue[];
}

export default function PieChart({ issues }: PieChartProps) {
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const solvedCount = issues.filter(i => i.status === 'solved').length;

  const data = [
    { name: 'Pending', value: pendingCount, color: '#F97316' },
    { name: 'Solved', value: solvedCount, color: '#10B981' },
  ];

  const COLORS = ['#F97316', '#10B981'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Issue Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

