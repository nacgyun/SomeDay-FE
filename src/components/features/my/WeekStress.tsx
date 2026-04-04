export interface DailyStress {
  day: string;
  level: number; // 0 ~ 100
}

interface WeekStressProps {
  data: DailyStress[];
  isLoading?: boolean;
}

const WeekStress = ({ data, isLoading }: WeekStressProps) => {
  const getBarColorInfo = (level: number) => {
    // 안정도 수치(Stability Score) 기준: 높을수록 안정적(초록), 낮을수록 피료/불안(빨강)
    if (level < 30) return { bg: 'bg-brand-red', shadow: 'shadow-brand-red/40' };
    if (level < 60) return { bg: 'bg-brand-orange', shadow: 'shadow-brand-orange/40' };
    return { bg: 'bg-brand-green', shadow: 'shadow-brand-green/40' };
  };

  return (
    <div className="bg-[#B6754C] shadow-md rounded-[20px] p-4">
      <div className="flex items-center justify-between mb-3 text-white">
        <h3 className="text-sm font-semibold">주간 안정도 수치</h3>
        <span className="text-xs opacity-80 font-medium">최근 7일</span>
      </div>

      <div className="flex items-end justify-between h-[150px] gap-1 mt-2 px-1">
        {Array.from({ length: 7 }).map((_, index) => {
          const isSkeleton = isLoading;
          const item = !isSkeleton && data[index] ? data[index] : null;
          const level = (item as DailyStress)?.level;
          const hasData = level !== null && level !== undefined;
          
          const heightPercent = isSkeleton ? 40 : (hasData ? Math.max((level / 100) * 100, 6) : 0); 
          const colorInfo = getBarColorInfo(level ?? 0);
          const isToday = !isSkeleton && index === (data.length > 0 ? data.length - 1 : 6);

          return (
            <div key={index} className="flex flex-col items-center gap-3 flex-1 group">
              {/* 막대 컨테이너 */}
              <div className="relative w-full flex justify-center items-end h-[100px] transition rounded-md">
                {/* 호버 시 나타나는 수치 툴팁 (데이터가 있을 때만) */}
                {!isSkeleton && hasData && (
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[10px] font-bold rounded-md px-2 py-1 shadow-md pointer-events-none z-10 text-[#B6754C] whitespace-nowrap">
                    {level}
                  </div>
                )}

                {/* 막대 그래프 / 스켈레톤 */}
                <div
                  className={[
                    'w-[22px] sm:w-[26px] rounded-md transition-all duration-700 ease-out',
                    isSkeleton ? 'bg-white/20 animate-pulse' : 
                    hasData ? `${colorInfo.bg} ${level >= 10 ? colorInfo.shadow : ''} shadow-[0_0_8px_var(--tw-shadow-color)] hover:scale-x-110 cursor-pointer`
                    : 'bg-transparent', // 데이터 없으면 투명
                  ].join(' ')}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* 요일 라벨 */}
              <div className={`min-h-[20px] flex justify-center items-center ${isSkeleton ? 'w-6 bg-white/10 rounded animate-pulse' : ''}`}>
                 <span className={`text-[11px] ${isToday ? 'text-white font-bold' : 'text-white/90 font-medium'}`}>
                  {!isSkeleton ? ((item as DailyStress)?.day || '-') : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekStress;
