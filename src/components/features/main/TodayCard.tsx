import Badge from '../../ui/Badge';
import ProgressBar from '../../ui/ProgressBar';

interface TodayCardProps {
  done: number;
  total: number;
  message?: string;
}

const TodayCard = ({ done, total, message = '오늘도 한 걸음씩!' }: TodayCardProps) => {
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-brand-purple/[0.13] to-brand-blue/[0.13] border border-brand-purple/25 rounded-[20px] p-6">
      <Badge color="purple" className="mb-2.5">오늘의 목표</Badge>
      <p className="text-xl font-bold text-white mb-4 mt-0">{message}</p>
      <ProgressBar value={progress} color="purple" />
      <p className="text-[13px] text-white/55 mt-2 mb-0">
        {done} / {total} 미션 완료
      </p>
    </div>
  );
};

export default TodayCard;
