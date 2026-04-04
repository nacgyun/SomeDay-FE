import type { FC } from 'react';

export interface DailyStress {
  day: string;
  level: number; // 0 ~ 100
}

interface MentalFlowProps {
  data: DailyStress[];
}

const MentalFlow: FC<MentalFlowProps> = ({ data }) => {
  const maxLevel = 100;

  // 가장 힘든 날 찾기 (수치가 가장 높은 첫 번째 날)
  const hardestDayItem = data.reduce(
    (max, current) => (max.level > current.level ? max : current),
    data[0]
  );

  const getBarColorInfo = (level: number) => {
    if (level < 40) return { bg: 'bg-brand-green', shadow: 'shadow-brand-green/40' };
    if (level < 75) return { bg: 'bg-brand-orange', shadow: 'shadow-brand-orange/40' };
    return { bg: 'bg-brand-red', shadow: 'shadow-brand-red/40' };
  };

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-5">
      <div className="mb-4">
        <h3 className="text-[13px] font-medium text-white/50 mb-1">이번 주 스트레스 흐름</h3>
        <h2 className="text-[19px] font-bold text-white">
          <span className="text-brand-orange drop-shadow-md">{hardestDayItem.day}요일</span>이 가장 힘들었어요
        </h2>
      </div>

      <div className="flex items-end justify-between h-[120px] gap-1 mt-4 px-1">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.level / maxLevel) * 100, 4); // 최소 높이 보장
          const colorInfo = getBarColorInfo(item.level);
          const isToday = index === data.length - 1;

          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              {/* 막대 컨테이너 */}
              <div className="relative w-full flex justify-center items-end h-[100px] transition hover:bg-white/[0.03] rounded-md">
                {/* 호버 시 나타나는 수치 툴팁 */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-secondary text-[10px] font-bold rounded-md px-2 py-1 shadow-lg pointer-events-none border border-white/10 z-10 text-white">
                  {item.level}
                </div>

                {/* 막대 그래프 */}
                <div
                  className={`w-[22px] sm:w-[28px] rounded-md transition-all duration-700 ease-out ${colorInfo.bg} ${item.level >= 20 ? colorInfo.shadow : ''} shadow-[0_0_8px_var(--tw-shadow-color)]`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* 요일 라벨 */}
              <span className={`text-[11px] ${isToday ? 'text-white font-bold' : 'text-white/40'}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentalFlow;
