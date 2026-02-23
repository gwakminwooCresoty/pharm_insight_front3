interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'excel';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  title?: string;
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md disabled:bg-primary-300 focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-1',
  secondary:
    'bg-white text-gray-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-1',
  danger:
    'bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100 hover:ring-red-300 active:bg-red-200 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-1',
  ghost:
    'text-gray-600 hover:bg-slate-100 hover:text-gray-800 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-500/40',
  excel:
    'bg-[#217346] text-white hover:bg-[#1a5c38] active:bg-[#155a32] shadow-sm disabled:bg-green-300 focus-visible:ring-2 focus-visible:ring-green-500/40 focus-visible:ring-offset-1',
};

const sizeClass: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-button)] font-medium transition-all duration-[var(--transition-fast)] cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {children}
    </button>
  );
}
