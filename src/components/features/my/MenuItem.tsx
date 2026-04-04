import type { MenuItemType } from '../../../types';

interface MenuItemProps {
  item: MenuItemType;
  onClick?: () => void;
  isLast?: boolean;
}

const MenuItem = ({ item, onClick, isLast = false }: MenuItemProps) => {
  return (
    <button
      id={`my-menu-${item.id}`}
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3.5 px-[18px] py-4 text-left border-none',
        'bg-transparent cursor-pointer',
        'transition-colors duration-200 hover:bg-slate-50',
        !isLast ? 'border-b border-b-slate-100' : '',
      ].join(' ')}
    >
      <span className="text-xl flex-shrink-0">{item.icon}</span>
      <span className="flex-1 text-sm font-medium text-slate-700">{item.label}</span>
      <span className="text-xl text-slate-300 group-hover:text-slate-400">›</span>
    </button>
  );
};

export default MenuItem;
