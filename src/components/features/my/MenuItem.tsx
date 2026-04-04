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
        'w-full flex items-center gap-3.5 px-[18px] py-4 text-left',
        'bg-transparent border-none cursor-pointer',
        'transition-colors duration-200 hover:bg-white/5',
        !isLast ? 'border-b border-b-white/[0.06]' : '',
      ].join(' ')}
    >
      <span className="text-xl flex-shrink-0">{item.icon}</span>
      <span className="flex-1 text-sm font-medium text-white/85">{item.label}</span>
      <span className="text-xl text-white/30">›</span>
    </button>
  );
};

export default MenuItem;
