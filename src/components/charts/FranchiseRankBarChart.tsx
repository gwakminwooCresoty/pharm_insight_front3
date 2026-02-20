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
import { FRANCHISE_RANK_COLORS } from '@/utils/chartColors';
import { TOOLTIP_PROPS } from '@/components/charts/ChartTooltip';

interface FranchiseRankBarChartProps {
  franchises: FranchiseSummary[];
}

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`;
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`;
  return String(value);
}

export default function FranchiseRankBarChart({
  franchises,
}: FranchiseRankBarChartProps) {
  const data = franchises.slice(0, 8).map((f) => ({
    name: f.franchiseName,
    sales: f.totalSales,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 36 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, angle: -25, textAnchor: 'end', dy: 4 }}
          interval={0}
        />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
        <Tooltip
          {...TOOLTIP_PROPS}
          formatter={(value: number) => [
            value.toLocaleString('ko-KR') + '원',
            '매출액',
          ]}
        />
        <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={index} fill={FRANCHISE_RANK_COLORS[index % FRANCHISE_RANK_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
