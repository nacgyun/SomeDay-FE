import type { FC } from 'react';
import type { Mission } from '../../../types';

interface MissionOXListProps {
  missions: Mission[];
  selectedDayOffset: number;
  onDaySelect: (offset: number) => void;
}

const MissionOXList: FC<MissionOXListProps> = ({ missions, selectedDayOffset, onDaySelect }) => {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  
  // 6일 전부터 오늘까지의 데이터를 생성
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const offset = i; // 0 = 6일 전, 6 = 오늘
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - offset));
    
    const dayName = DAYS[date.getDay()];
    const dayMissions = missions.filter(m => m.dayOffset === offset);
    const doneCount = dayMissions.filter(m => m.done).length;
    const totalCount = dayMissions.length || 3; // 기본 3개
    
    let status: 'O' | '△' | 'X' = 'X';
    if (doneCount === totalCount && totalCount > 0) {
      status = 'O';
    } else if (doneCount > 0) {
      status = '△';
    }
    
    return {
      offset,
      dayName,
      status,
      doneCount,
      totalCount,
      isToday: offset === 6,
    };
  });

  return (
    <div className="bg-[#B6754C] shadow-md rounded-[24px] p-5">
      <div className="mb-4">
        <h3 className="text-[13px] font-medium text-white/80 mb-0.5 text-center">지난 7일간의 기록</h3>
      </div>

      <div className="flex justify-between items-center gap-1.5 pt-1">
        {weekData.map((day) => {
          const isSelected = selectedDayOffset === day.offset;
          
          return (
            <button
              key={day.offset}
              onClick={() => onDaySelect(day.offset)}
              className={`flex-1 flex flex-col items-center gap-3 py-3 rounded-2xl transition-all duration-200 cursor-pointer
                ${isSelected ? 'bg-white/15 scale-105 shadow-sm' : 'hover:bg-white/5'}
              `}
            >
              {/* 요일 라벨 */}
              <span className={`text-[11px] font-bold ${day.isToday ? 'text-[#FFCB9A]' : 'text-white/60'}`}>
                {day.dayName}
              </span>

              {/* 상태 아이콘 (O, △, X) */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-black shadow-sm transition-transform
                ${day.status === 'O' ? 'bg-brand-green text-white scale-110 shadow-brand-green/30' : 
                  day.status === '△' ? 'bg-brand-orange text-white' : 
                  'bg-white/10 text-white/30'}
                ${isSelected ? 'ring-2 ring-white/30' : ''}
              `}>
                {day.status === 'O' ? '✓' : day.status === '△' ? '△' : '✕'}
              </div>

              {/* 하단 점 표시 (선택 시 혹은 오늘일 때) */}
              {day.isToday && !isSelected && <div className="w-1 h-1 rounded-full bg-[#FFCB9A]" />}
              {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
              {!day.isToday && !isSelected && <div className="h-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MissionOXList;
