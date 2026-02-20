interface KpiCardProps {
  label: string;
  value: string;
  compareRatio?: number;
  subLabel?: string;
  icon?: React.ReactNode;
}

export default function KpiCard({
  label,
  value,
  compareRatio,
  subLabel,
  icon,
}: KpiCardProps) {
  const isPositive = compareRatio !== undefined && compareRatio >= 0;
  const isNegative = compareRatio !== undefined && compareRatio < 0;

  return (
    <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-gray-300">{icon}</span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-bold text-gray-900 leading-none">{value}</span>
        {compareRatio !== undefined && (
          <span
            className={`text-[11px] font-semibold ${
              isPositive
                ? 'text-emerald-500'
                : isNegative
                  ? 'text-red-400'
                  : 'text-gray-300'
            }`}
          >
            {isPositive ? '▲' : isNegative ? '▼' : ''}
            {Math.abs(compareRatio).toFixed(1)}%
          </span>
        )}
      </div>
      {subLabel && (
        <span className="text-[11px] text-gray-300 mt-0.5 block">{subLabel}</span>
      )}
    </div>
  );
}
