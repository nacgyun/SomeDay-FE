import { ReactNode } from 'react';

type Color = 'purple' | 'blue' | 'green' | 'orange';

interface BadgeProps {
  children: ReactNode;
  color?: Color;
  className?: string;
}

const colorStyles: Record<Color, string> = {
  purple: 'bg-brand-purple/25 text-brand-purple-light',
  blue:   'bg-brand-blue/25 text-brand-blue',
  green:  'bg-brand-green/25 text-brand-green',
  orange: 'bg-brand-orange/20 text-brand-orange',
};

const Badge = ({ children, color = 'purple', className = '' }: BadgeProps) => {
  return (
    <span
      className={[
        'inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full',
        'uppercase tracking-[0.5px]',
        colorStyles[color],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};

export default Badge;
