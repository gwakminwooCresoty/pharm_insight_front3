import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { DailySettlement } from '@/data/settlement.dummy';

const COLORS: Record<string, string> = {
  카드: '#3b82f6',
  현금: '#10b981',
  포인트: '#f59e0b',
  기타: '#8b5cf6',
};

interface PaymentStackBarChartProps {
  dailyTrend: DailySettlement[];
}

export default function PaymentStackBarChart({
  dailyTrend,
}: PaymentStackBarChartProps) {
  const data = dailyTrend.slice(0, 30).map((d) => {
    const row: Record<string, string | number> = { date: d.date };
    for (const b of d.breakdown) {
      row[b.paymentName] = b.sales;
    }
    return row;
  });

  const paymentNames = dailyTrend[0]?.breakdown.map((b) => b.paymentName) ?? [];

  function formatYAxis(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}백만`;
    return String(value);
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
        <Tooltip
          formatter={(value: number, name: string) => [
            value.toLocaleString('ko-KR') + '원',
            name,
          ]}
        />
        <Legend />
        {paymentNames.map((name) => (
          <Bar
            key={name}
            dataKey={name}
            stackId="payment"
            fill={COLORS[name] ?? '#94a3b8'}
            radius={name === paymentNames[paymentNames.length - 1] ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
