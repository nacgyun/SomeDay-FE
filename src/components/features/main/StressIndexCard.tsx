interface StressIndexCardProps {
  score: number;          // 0~100
  message?: string;
  bubbleText?: string;    // 말풍선 텍스트
}

type StressLevel = {
  label: string;
  icon: string;
  color: string;
  barColor: string;
  bgColor: string;
  borderColor: string;
};

function getLevel(score: number): StressLevel {
  if (score >= 80) return {
    label: '위험 — 타워가 많이 흔들려요',
    icon: '🚨',
    color: 'text-red-400',
    barColor: 'bg-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
  };
  if (score >= 60) return {
    label: '주의 필요 — 타워가 흔들리고 있어요',
    icon: '⚠️',
    color: 'text-amber-400',
    barColor: 'bg-gradient-to-r from-amber-400 to-orange-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
  };
  if (score >= 40) return {
    label: '보통 — 균형을 잘 유지하고 있어요',
    icon: '🟡',
    color: 'text-yellow-300',
    barColor: 'bg-gradient-to-r from-yellow-300 to-amber-300',
    bgColor: 'bg-yellow-300/10',
    borderColor: 'border-yellow-300/30',
  };
  return {
    label: '안정 — 타워가 튼튼해요',
    icon: '✅',
    color: 'text-brand-green',
    barColor: 'bg-gradient-to-r from-brand-green to-brand-green-dark',
    bgColor: 'bg-brand-green/10',
    borderColor: 'border-brand-green/30',
  };
}

const StressIndexCard = ({
  score,
  bubbleText = '오늘도 이근... 이번 주면 세 번째야. 언제쯤 끝나려나 😢',
}: StressIndexCardProps) => {
  const level = getLevel(score);

  return (
    <div className={`rounded-[20px] p-5 border ${level.bgColor} ${level.borderColor}`}>
      {/* 상단: 수치 + 레이블 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 점수 */}
        <div className="flex flex-col items-start">
          <span className="text-[11px] text-white/45 mb-1">오늘의 스트레스 지수</span>
          <span className={`text-[52px] font-black leading-none ${level.color}`}>{score}</span>
        </div>

        {/* 바 + 상태 */}
        <div className="flex-1 pt-6">
          {/* 프로그레스 바 */}
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${level.barColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className={`text-xs font-medium ${level.color}`}>
            {level.icon} {level.label}
          </p>
        </div>
      </div>

      {/* 말풍선 */}
      <div className="relative bg-white/[0.07] border border-white/10 rounded-[14px] rounded-tl-sm px-4 py-3">
        <p className="text-[13px] text-white/80 leading-relaxed">{bubbleText}</p>
      </div>
    </div>
  );
};

export default StressIndexCard;
