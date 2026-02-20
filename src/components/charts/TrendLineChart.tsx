import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TrendPoint } from '@/data/pos.dummy';
import { TOOLTIP_PROPS } from '@/components/charts/ChartTooltip';

interface TrendLineChartProps {
  data: TrendPoint[];
  showCompare?: boolean;
}

function formatYAxis(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
  return String(value);
}

export default function TrendLineChart({
  data,
  showCompare = false,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="axis" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
        <Tooltip
          {...TOOLTIP_PROPS}
          formatter={(value: number, name: string) => [
            value.toLocaleString('ko-KR') + '원',
            name === 'sales' ? '매출액' : name === 'compareSales' ? '비교기간' : name,
          ]}
        />
        <Legend
          formatter={(value) =>
            value === 'sales' ? '매출액' : value === 'compareSales' ? '비교기간' : value
          }
        />
        <Bar dataKey="sales" fill="#3b82f6" name="sales" radius={[4, 4, 0, 0]} />
        {showCompare && (
          <Line
            type="monotone"
            dataKey="compareSales"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="compareSales"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
