interface KpiCardProps {
  label: string;
  value: string;
  compareRatio?: number;
  subLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

export default function KpiCard({
  label,
  value,
  compareRatio,
  subLabel,
  icon,
  iconBg = 'bg-primary-50 text-primary-500',
}: KpiCardProps) {
  const isPositive = compareRatio !== undefined && compareRatio >= 0;
  const isNegative = compareRatio !== undefined && compareRatio < 0;

  return (
    <div className="bg-white rounded-[var(--radius-card)] border border-slate-100 px-4 py-3 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-[var(--transition-normal)] flex flex-col justify-center">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-gray-900 leading-none whitespace-nowrap">{value}</span>
        {compareRatio !== undefined && (
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : isNegative
                  ? 'bg-red-50 text-red-500'
                  : 'bg-slate-50 text-slate-400'
              }`}
          >
            {isPositive ? '▲' : isNegative ? '▼' : ''}
            {Math.abs(compareRatio).toFixed(1)}%
          </span>
        )}
      </div>
      {subLabel && (
        <span className="text-[11px] text-slate-400 mt-1 block">{subLabel}</span>
      )}
    </div>
  );
}
