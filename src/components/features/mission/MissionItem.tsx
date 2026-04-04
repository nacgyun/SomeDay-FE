import type { Mission } from '../../../types';

interface MissionItemProps {
  mission: Mission;
  onToggle?: (id: number) => void;
}

const MissionItem = ({ mission, onToggle }: MissionItemProps) => {
  return (
    <div
      className={[
        'flex items-center gap-3 bg-white border border-slate-100 shadow-sm',
        'rounded-2xl px-4 py-4 transition-opacity duration-200',
        mission.done ? 'opacity-60 bg-slate-50' : 'opacity-100',
      ].join(' ')}
    >
      {/* 체크 버튼 */}
      <button
        id={`mission-check-${mission.id}`}
        onClick={() => !mission.done && onToggle?.(mission.id)}
        className={[
          'w-[26px] h-[26px] rounded-full border-2 flex-shrink-0',
          'flex items-center justify-center text-sm font-bold',
          'transition-all duration-200',
          mission.done
            ? 'bg-brand-green border-brand-green text-white cursor-default'
            : 'bg-transparent border-slate-200 text-transparent cursor-pointer hover:bg-slate-50',
        ].join(' ')}
      >
        {mission.done ? '✓' : ''}
      </button>

      {/* 아이콘 */}
      <span className="text-2xl flex-shrink-0">{mission.icon}</span>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className={[
          'text-[14px] font-semibold mb-0.5 truncate',
          mission.done ? 'line-through text-slate-400' : 'text-slate-800'
        ].join(' ')}>
          {mission.title}
        </p>
        <span className="text-[11px] text-slate-500">{mission.category}</span>
      </div>

      {/* 포인트 */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-base font-extrabold text-brand-green-dark">+{mission.point}</span>
        <span className="text-[11px] text-slate-400 font-medium">안정도</span>
      </div>
    </div>
  );
};

export default MissionItem;
