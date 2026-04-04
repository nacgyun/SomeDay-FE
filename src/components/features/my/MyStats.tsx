import type { FC } from 'react';

interface StatItemProps {
  title: string;
  value: number | string;
  unit: string;
  icon: string;
  colorClass: string;
}

const StatItem: FC<StatItemProps> = ({ title, value, unit, icon, colorClass }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-[20px] p-4 flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-slate-50">
    <div className={`text-2xl mb-1 ${colorClass} opacity-90 drop-shadow-sm`}>
      {icon}
    </div>
    <div className="flex items-baseline gap-0.5">
      <span className="text-xl font-bold text-slate-800">{value}</span>
      <span className="text-xs text-slate-500">{unit}</span>
    </div>
    <span className="text-[11px] text-slate-400 font-medium">{title}</span>
  </div>
);

interface MyStatsProps {
  consecutiveDays: number;
  towerFloors: number;
  receivedCheers: number;
  sentConsoles: number;
}

const MyStats: FC<MyStatsProps> = ({
  consecutiveDays,
  towerFloors,
  receivedCheers,
  sentConsoles,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatItem
        title="연속 기록"
        value={consecutiveDays}
        unit="일"
        icon="🔥"
        colorClass="text-brand-orange"
      />
      <StatItem
        title="누적 타워"
        value={towerFloors}
        unit="층"
        icon="🏢"
        colorClass="text-brand-purple"
      />
      <StatItem
        title="받은 응원"
        value={receivedCheers}
        unit="회"
        icon="💌"
        colorClass="text-pink-400"
      />
      <StatItem
        title="보낸 위로"
        value={sentConsoles}
        unit="회"
        icon="🤝"
        colorClass="text-brand-green"
      />
    </div>
  );
};

export default MyStats;
