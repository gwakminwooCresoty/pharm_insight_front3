interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'orange' | 'red' | 'gray' | 'blue' | 'yellow';
}

const colorClass: Record<NonNullable<BadgeProps['color']>, string> = {
  green: 'bg-green-100 text-green-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
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
