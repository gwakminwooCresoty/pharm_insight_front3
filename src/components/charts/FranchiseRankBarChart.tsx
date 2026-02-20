import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import type { FranchiseSummary } from '@/data/platform.dummy';

interface FranchiseRankBarChartProps {
  franchises: FranchiseSummary[];
}

const COLORS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#ddd6fe',
  '#e0e7ff',
  '#c7d2fe',
];

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`;
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`;
  return String(value);
}

export default function FranchiseRankBarChart({
  franchises,
}: FranchiseRankBarChartProps) {
  const data = franchises.slice(0, 8).map((f) => ({
    name: f.franchiseName.slice(0, 6),
    sales: f.totalSales,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
        <Tooltip
          formatter={(value: number) => [
            value.toLocaleString('ko-KR') + '원',
            '매출액',
          ]}
        />
        <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
