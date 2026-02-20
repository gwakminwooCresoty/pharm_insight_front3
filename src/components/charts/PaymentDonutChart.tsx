import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PaymentBreakdown } from '@/data/settlement.dummy';
import { PAYMENT_COLOR_LIST } from '@/utils/chartColors';
import { TOOLTIP_PROPS } from '@/components/charts/ChartTooltip';

interface PaymentDonutChartProps {
  breakdown: PaymentBreakdown[];
}

function formatCenter(value: number): string {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억`;
  if (value >= 10_000) return `${Math.round(value / 10_000).toLocaleString()}만`;
  return value.toLocaleString();
}

export default function PaymentDonutChart({ breakdown }: PaymentDonutChartProps) {
  const data = breakdown.map((b) => ({ name: b.paymentName, value: b.sales }));
  const total = breakdown.reduce((sum, b) => sum + b.sales, 0);

  // cy="45%" of height 280px = 126px — overlay is anchored to that point
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={105}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={PAYMENT_COLOR_LIST[index % PAYMENT_COLOR_LIST.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_PROPS.contentStyle}
            labelStyle={TOOLTIP_PROPS.labelStyle}
            itemStyle={TOOLTIP_PROPS.itemStyle}
            formatter={(value: number) => [value.toLocaleString('ko-KR') + '원', '매출액']}
          />
          <Legend
            formatter={(value, entry) => {
              const percent = entry.payload
                ? (((entry.payload as { value: number }).value / total) * 100).toFixed(1)
                : '';
              return `${value} ${percent}%`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute pointer-events-none text-center"
        style={{ top: '126px', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="text-xs text-gray-400">합계</div>
        <div className="text-lg font-bold text-gray-900">{formatCenter(total)}</div>
      </div>
    </div>
  );
}
