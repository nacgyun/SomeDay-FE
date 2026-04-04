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
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-full text-slate-600 hover:text-brand-orange shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}
        <h2 className="text-3xl font-cute font-bold text-[#4a3b32] m-0">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default PageHeader;
