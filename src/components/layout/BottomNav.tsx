import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navigation';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-3 pb-3">
      <div
        className={[
          'flex items-center',
          'bg-[rgba(20,20,35,0.92)] backdrop-blur-2xl',
          'border border-white/10 rounded-3xl',
          'py-2 px-1',
          'shadow-[0_-4px_30px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.3)]',
        ].join(' ')}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={() => navigate(item.path)}
              className={[
                'flex-1 flex flex-col items-center gap-[3px] py-2 px-1',
                'relative rounded-[18px] transition-all duration-200 cursor-pointer',
                'border-none bg-transparent',
                isActive ? 'bg-brand-purple/15' : 'hover:bg-white/5',
              ].join(' ')}
            >
              <span
                className={[
                  'text-[22px] leading-none block transition-transform duration-200',
                  isActive ? '-translate-y-0.5' : '',
                ].join(' ')}
              >
                {item.icon}
              </span>
              <span
                className={[
                  'text-[10px] font-medium leading-none transition-colors duration-200',
                  isActive ? 'text-brand-purple font-bold' : 'text-white/40',
                ].join(' ')}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-[5px] w-1 h-1 rounded-full bg-brand-purple animate-dot-appear" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
