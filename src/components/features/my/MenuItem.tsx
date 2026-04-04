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
        'w-full flex items-center gap-3.5 px-[18px] py-4 text-left border-none group',
        'bg-transparent cursor-pointer',
        'transition-colors duration-200 hover:bg-slate-50',
        !isLast ? 'border-b border-b-slate-100' : '',
      ].join(' ')}
    >
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-brand-orange/5 group-hover:text-brand-orange-dark transition-colors duration-200">
        <span className="text-xl flex items-center justify-center">{item.icon}</span>
      </div>
      <span className="flex-1 text-sm font-semibold text-slate-700 tracking-tight">{item.label}</span>
      <span className="text-xl text-slate-300 group-hover:text-brand-orange transition-colors duration-200">›</span>
    </button>
  );
};

export default MenuItem;
