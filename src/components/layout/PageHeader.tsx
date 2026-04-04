import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  gradientColor?: 'purple' | 'blue' | 'green' | 'orange';
  action?: ReactNode;
}

const gradientStyles = {
  purple: 'from-brand-purple/12',
  blue:   'from-brand-blue/12',
  green:  'from-brand-green/12',
  orange: 'from-brand-orange/12',
};

const PageHeader = ({ title, gradientColor = 'purple', action }: PageHeaderProps) => {
  return (
    <header
      className={[
        'flex items-center justify-between',
        'pt-[52px] pb-5 px-5',
        `bg-gradient-to-b ${gradientStyles[gradientColor]} to-transparent`,
      ].join(' ')}
    >
      <h2 className="text-2xl font-extrabold text-white m-0">{title}</h2>
      {action && <div>{action}</div>}
    </header>
  );
};

export default PageHeader;
