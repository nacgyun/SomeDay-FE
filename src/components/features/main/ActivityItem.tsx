import type { ActivityItem as ActivityItemType } from '../../../types';

const ActivityItem = ({ icon, text, time }: ActivityItemType) => {
  return (
    <div className="flex items-center gap-3.5 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-4 py-3.5">
      <span className="text-[22px] flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-white mb-0.5 truncate">{text}</p>
        <span className="text-xs text-white/40">{time}</span>
      </div>
      <span className="text-base flex-shrink-0">✅</span>
    </div>
  );
};

export default ActivityItem;
