import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = '선택',
  label,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === options.length
        ? '전체'
        : `${selected.length}개 선택`;

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between ring-1 ring-slate-200 rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white hover:ring-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 transition-all duration-[var(--transition-fast)] min-w-32"
        >
          <span className={selected.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
            {displayText}
          </span>
          <ChevronDown size={14} className={`text-slate-400 ml-2 transition-transform duration-[var(--transition-fast)] ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full min-w-40 bg-white ring-1 ring-slate-200 rounded-lg shadow-[var(--shadow-card-hover)] max-h-48 overflow-y-auto animate-[slideUp_150ms_ease-out]">
            <label className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
              <input
                type="checkbox"
                checked={selected.length === options.length}
                onChange={(e) =>
                  onChange(e.target.checked ? options.map((o) => o.value) : [])
                }
                className="accent-primary-600"
              />
              <span className="text-sm font-medium text-slate-700">전체</span>
            </label>
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors duration-[var(--transition-fast)]"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="accent-primary-600"
                />
                <span className="text-sm text-slate-600">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
