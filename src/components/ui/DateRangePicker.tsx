interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  label?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label,
}: DateRangePickerProps) {
  const inputClass =
    'ring-1 ring-slate-200 rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white hover:ring-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 transition-all duration-[var(--transition-fast)]';

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className={inputClass}
        />
        <span className="text-slate-300 text-sm">~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}
