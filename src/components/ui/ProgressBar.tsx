type Color = 'purple' | 'green' | 'orange';

interface ProgressBarProps {
  value: number;       // 0~100 (%)
  color?: Color;
  height?: string;
}

const trackBg = 'bg-white/10';

const fillStyles: Record<Color, string> = {
  purple: 'bg-gradient-to-r from-brand-purple to-brand-blue',
  green:  'bg-gradient-to-r from-brand-green to-brand-green-dark',
  orange: 'bg-gradient-to-r from-brand-orange to-brand-orange-dark',
};

const ProgressBar = ({ value, color = 'purple', height = 'h-2' }: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`${trackBg} ${height} rounded-full overflow-hidden`}>
      <div
        className={`${fillStyles[color]} h-full rounded-full transition-[width] duration-700 ease-in-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
