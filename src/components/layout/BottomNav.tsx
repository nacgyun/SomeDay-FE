import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';
import { HomeIcon, UsersIcon, TargetIcon, UserIcon } from '../icons/AppIcons';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getIcon = (iconId: string, color: string) => {
    switch (iconId) {
      case 'home': return <HomeIcon color={color} className="w-6 h-6" />;
      case 'social': return <UsersIcon color={color} className="w-6 h-6" />;
      case 'mission': return <TargetIcon color={color} className="w-6 h-6" />;
      case 'my': return <UserIcon color={color} className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-3 pb-3">
      <div
        className={[
          'flex items-center',
          'bg-white/90 backdrop-blur-2xl',
          'border border-slate-200/50 rounded-3xl',
          'py-2 px-1',
          'shadow-[0_-4px_30px_rgba(0,0,0,0.05),0_4px_20px_rgba(0,0,0,0.03)]',
        ].join(' ')}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const activeColor = '#B6754C';
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => navigate(item.path)}
              className={[
                'flex-1 flex flex-col items-center gap-[3px] py-2 px-1',
                'relative rounded-[18px] transition-all duration-200 cursor-pointer',
                'border-none bg-transparent',
                isActive ? 'bg-[#B6754C]/12' : 'hover:bg-slate-100/50',
              ].join(' ')}
            >
              <span
                className={[
                  'text-[22px] leading-none block transition-transform duration-200 flex items-center justify-center',
                  isActive ? '-translate-y-0.5' : 'opacity-60 text-slate-400',
                ].join(' ')}
              >
                {getIcon(item.icon, isActive ? activeColor : 'currentColor')}
              </span>
              <span
                className={[
                  'text-[10px] font-medium leading-none transition-colors duration-200',
                  isActive ? 'text-[#B6754C] font-bold' : 'text-slate-400',
                ].join(' ')}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-[0px] w-1 h-1 rounded-full bg-[#B6754C] animate-dot-appear" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
