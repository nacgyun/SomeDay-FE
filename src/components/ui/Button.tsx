import { ButtonHTMLAttributes } from 'react';

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
    'bg-white/[0.06] border border-white/10 text-white/65 hover:bg-white/[0.12] hover:text-white',
  green:
    'bg-gradient-to-br from-brand-green to-brand-green-dark text-white shadow-[0_4px_16px_rgba(52,211,153,0.35)] hover:-translate-y-0.5',
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
