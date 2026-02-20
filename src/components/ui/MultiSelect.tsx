import { useState, useRef, useEffect } from 'react';

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
      {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-32"
        >
          <span className={selected.length === 0 ? 'text-gray-400' : ''}>
            {displayText}
          </span>
          <span className="text-gray-400 ml-2">▾</span>
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full min-w-40 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
              <input
                type="checkbox"
                checked={selected.length === options.length}
                onChange={(e) =>
                  onChange(e.target.checked ? options.map((o) => o.value) : [])
                }
                className="accent-blue-600"
              />
              <span className="text-sm font-medium">전체</span>
            </label>
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
