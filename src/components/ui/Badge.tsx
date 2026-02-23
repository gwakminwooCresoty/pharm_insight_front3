interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'yellow';
}

const colorClass: Record<NonNullable<BadgeProps['color']>, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/10',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
  gray: 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10',
  blue: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10',
  yellow: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10',
};

export default function Badge({
  children,
  color = 'gray',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass[color]}`}
    >
      {children}
    </span>
  );
}
