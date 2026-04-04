import ProgressBar from '../../ui/ProgressBar';

interface MissionProgressCardProps {
  done: number;
  total: number;
}

const MissionProgressCard = ({ done, total }: MissionProgressCardProps) => {
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-brand-green/[0.15] to-brand-green-dark/[0.08] border border-brand-green/25 rounded-[20px] p-5">
      <div className="flex justify-between mb-3">
        <span className="text-sm text-white/70">오늘의 진행률</span>
        <span className="text-sm font-bold text-brand-green">
          {done} / {total}
        </span>
      </div>
      <ProgressBar value={progress} color="green" />
    </div>
  );
};

export default MissionProgressCard;
