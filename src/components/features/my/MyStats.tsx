import type { FC, ReactNode } from 'react';
import { JengaIcon } from '../../icons/JengaIcon';
import { FlameIcon, MailIcon, HeartIcon } from '../../icons/AppIcons';

interface StatItemProps {
  title: string;
  value: number | string;
  unit: string;
  icon: ReactNode;
  colorClass: string;
}

const StatItem: FC<StatItemProps> = ({ title, value, unit, icon, colorClass }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-[20px] p-4 flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-slate-50 hover:shadow-md group">
    <div className={`text-2xl mb-1 ${colorClass} opacity-90 transition-transform group-hover:scale-110 flex items-center justify-center min-h-[32px] w-full`}>
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
        icon={<FlameIcon className="w-9 h-9" />}
        colorClass="text-brand-orange"
      />
      <StatItem
        title="누적 타워"
        value={towerFloors}
        unit="층"
        icon={<JengaIcon color="currentColor" className="w-7 h-7" />}
        colorClass="text-[#B6754C]"
      />
      <StatItem
        title="받은 응원"
        value={receivedCheers}
        unit="회"
        icon={<MailIcon className="w-7 h-7" />}
        colorClass="text-pink-400"
      />
      <StatItem
        title="보낸 위로"
        value={sentConsoles}
        unit="회"
        icon={<HeartIcon className="w-7 h-7" />}
        colorClass="text-brand-green"
      />
    </div>
  );
};

export default MyStats;
