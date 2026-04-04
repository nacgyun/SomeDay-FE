import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'kakao' | 'google' | 'ghost' | 'green' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-brand-purple to-brand-blue text-white shadow-[0_4px_20px_rgba(167,139,250,0.4)] hover:shadow-[0_8px_28px_rgba(167,139,250,0.5)] hover:-translate-y-0.5 active:translate-y-0',
  kakao:
    'bg-[#fee500] text-[#3c1e1e] hover:-translate-y-0.5 hover:brightness-105',
  google:
    'bg-white/[0.08] border border-white/[0.15] text-white hover:bg-white/[0.13] hover:-translate-y-0.5',
  ghost:
    'bg-slate-100/60 border border-slate-200 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900',
  green:
    'bg-[#B6754C] text-white shadow-sm hover:bg-[#a06642] active:scale-95',
  danger:
    'bg-red-500/10 border border-red-500/25 text-brand-red hover:bg-red-500/[0.18]',
};

const Button = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        'flex items-center justify-center gap-2 px-4 py-[15px] rounded-[14px]',
        'text-[15px] font-semibold cursor-pointer transition-all duration-200',
        'font-sans',
        fullWidth ? 'w-full' : '',
        variantStyles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
