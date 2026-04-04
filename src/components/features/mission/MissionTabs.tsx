import { MISSION_CATEGORIES } from '../../../constants/navigation';

interface MissionTabsProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

const MissionTabs = ({ activeCategory, onChange }: MissionTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
      {MISSION_CATEGORIES.map((tab) => {
        const isActive = tab === activeCategory;
        return (
          <button
            key={tab}
            id={`mission-tab-${tab}`}
            onClick={() => onChange(tab)}
            className={[
              'flex-shrink-0 text-[13px] font-medium px-4 py-[7px] rounded-full',
              'border cursor-pointer transition-all duration-200 whitespace-nowrap',
              isActive
                ? 'bg-brand-green/20 border-brand-green/50 text-brand-green font-semibold'
                : 'bg-white/[0.06] border-white/10 text-white/55 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default MissionTabs;
