import Badge from '../../ui/Badge';
import ProgressBar from '../../ui/ProgressBar';

interface LevelCardProps {
  level: number;
  currentPoint: number;
  maxPoint: number;
  totalPoint: number;
}

const LevelCard = ({ level, currentPoint, maxPoint, totalPoint }: LevelCardProps) => {
  const progress = (currentPoint / maxPoint) * 100;

  return (
    <div className="flex items-center gap-5 bg-gradient-to-br from-brand-orange/[0.12] to-brand-orange-dark/[0.06] border border-brand-orange/20 rounded-[20px] p-5">
      {/* 레벨 정보 */}
      <div className="flex-1 min-w-0">
        <Badge color="orange" className="mb-2">⭐ Lv.{level}</Badge>
        <p className="text-xs text-white/50 mb-1.5">다음 레벨까지</p>
        <ProgressBar value={progress} color="orange" height="h-1.5" />
        <p className="text-[11px] text-white/40 mt-1.5">
          {currentPoint.toLocaleString()} / {maxPoint.toLocaleString()} pt
        </p>
      </div>

      {/* 구분선 */}
      <div className="w-px h-[50px] bg-white/10 flex-shrink-0" />

      {/* 총 포인트 */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-[22px] font-extrabold text-brand-orange">
          {totalPoint.toLocaleString()}
        </span>
        <span className="text-[11px] text-white/45">총 포인트</span>
      </div>
    </div>
  );
};

export default LevelCard;
