import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PaymentBreakdown } from '@/data/settlement.dummy';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

interface PaymentDonutChartProps {
  breakdown: PaymentBreakdown[];
}

export default function PaymentDonutChart({ breakdown }: PaymentDonutChartProps) {
  const data = breakdown.map((b) => ({ name: b.paymentName, value: b.sales }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [value.toLocaleString('ko-KR') + '원', '매출액']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
