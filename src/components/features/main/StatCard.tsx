import type { StatItem } from '../../../types';

const colorStyles = {
  purple: 'bg-gradient-to-br from-brand-purple/[0.18] to-brand-purple-dark/10',
  blue:   'bg-gradient-to-br from-brand-blue/[0.18] to-brand-blue-dark/10',
  green:  'bg-gradient-to-br from-brand-green/[0.18] to-brand-green-dark/10',
};

const StatCard = ({ icon, value, label, color }: StatItem) => {
  return (
    <div
      className={[
        'flex flex-col items-center gap-1.5',
        'rounded-2xl p-[18px] px-3',
        'border border-white/[0.08]',
        colorStyles[color],
      ].join(' ')}
    >
      <span className="text-[22px] leading-none">{icon}</span>
      <span className="text-2xl font-extrabold text-white">{value}</span>
      <span className="text-[11px] text-white/50 text-center">{label}</span>
    </div>
  );
};

export default StatCard;
