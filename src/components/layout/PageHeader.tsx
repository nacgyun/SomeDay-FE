import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  gradientColor?: 'purple' | 'blue' | 'green' | 'orange';
  action?: ReactNode;
  onBack?: () => void;
}

const gradientStyles = {
  purple: 'from-brand-purple/12',
  blue: 'from-brand-blue/12',
  green: 'from-brand-green/12',
  orange: 'from-brand-orange/12',
};

const PageHeader = ({ title, gradientColor = 'purple', action, onBack }: PageHeaderProps) => {
  return (
    <header
      className={[
        'flex items-center justify-between',
        'pt-[52px] pb-5 px-5',
        `bg-gradient-to-b ${gradientStyles[gradientColor]} to-transparent`,
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-white/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-extrabold text-white m-0">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default PageHeader;
