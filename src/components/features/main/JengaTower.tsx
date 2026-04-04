// 젠가 타워를 CSS로 시각화하는 컴포넌트
// 각 row는 3개의 블록으로 구성, 홀수/짝수로 방향 교대
// 일부 블록은 pulled 상태로 색상이 달라짐

interface BlockConfig {
  pulled?: boolean;   // 빼낸 블록 여부
  color?: string;     // 커스텀 색상
}

interface RowConfig {
  blocks: [BlockConfig, BlockConfig, BlockConfig];
  tilted?: boolean;   // 살짝 기울어짐
}

// 젠가 타워 구성 (아래→위 순서)
const TOWER: RowConfig[] = [
  { blocks: [{}, {}, {}] },
  { blocks: [{}, { pulled: true, color: 'bg-brand-blue/70' }, {}] },
  { blocks: [{}, {}, {}] },
  { blocks: [{ pulled: true, color: 'bg-brand-purple/70' }, {}, {}], tilted: true },
  { blocks: [{}, {}, {}] },
  { blocks: [{}, {}, { pulled: true, color: 'bg-brand-green/60' }] },
  { blocks: [{}, {}, {}] },
  { blocks: [{ pulled: true, color: 'bg-amber-400/60' }, {}, {}], tilted: true },
  { blocks: [{}, {}, {}] },
  { blocks: [{}, { pulled: true, color: 'bg-brand-blue/60' }, {}] },
  { blocks: [{}, {}, {}] },
  { blocks: [{}, {}, {}] },
];

interface JengaTowerProps {
  stabilityScore?: number; // 0~100 (낮을수록 불안정)
}

const JengaTower = ({ stabilityScore = 60 }: JengaTowerProps) => {
  // 안정도에 따라 타워 기울기 결정
  const towerTilt = stabilityScore < 40 ? 'rotate-[-2deg]' : stabilityScore < 60 ? 'rotate-[-1deg]' : '';

  return (
    <div className="flex flex-col items-center py-2">
      {/* 안정도 레이블 */}
      <div className="text-center mb-4">
        <p className="text-[11px] text-white/40 mb-1">나의 젠가 타워</p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-brand-green rounded-full transition-all duration-1000"
              style={{ width: `${stabilityScore}%` }}
            />
          </div>
          <span className="text-xs text-white/55">
            안정도 <span className="text-white/80 font-semibold">{stabilityScore}%</span>
          </span>
        </div>
      </div>

      {/* 젠가 타워 */}
      <div className={`relative transition-transform duration-700 ${towerTilt}`}>
        {/* 그림자 (바닥) */}
        <div className="w-[130px] h-4 bg-black/30 blur-md rounded-full mx-auto mb-1" />

        {/* 블록 rows (아래에서 위로 쌓임 = flex-col-reverse) */}
        <div className="flex flex-col-reverse gap-[3px]">
          {TOWER.map((row, rowIdx) => {
            // 짝수 row: 가로 배치, 홀수 row: 약간 다른 배치 (원근감)
            const isEven = rowIdx % 2 === 0;
            return (
              <div
                key={rowIdx}
                className={[
                  'flex items-center justify-center gap-[3px]',
                  row.tilted ? (rowIdx % 3 === 0 ? 'translate-x-[3px]' : '-translate-x-[3px]') : '',
                ].join(' ')}
                style={{
                  transform: row.tilted
                    ? `translateX(${rowIdx % 2 === 0 ? '2' : '-2'}px) rotate(${rowIdx % 3 === 0 ? '0.3' : '-0.3'}deg)`
                    : undefined,
                }}
              >
                {row.blocks.map((block, blockIdx) => (
                  <div
                    key={blockIdx}
                    className={[
                      'rounded-[3px] transition-all duration-300',
                      // 블록 크기: 짝수/홀수 row에 따라 다름 (원근감)
                      isEven
                        ? 'w-[38px] h-[13px]'
                        : 'w-[36px] h-[13px]',
                      // 색상: pulled or 일반
                      block.pulled
                        ? `${block.color} border border-white/20`
                        : 'bg-[#c4956a] border border-[#a8774d]',
                    ].join(' ')}
                    style={{
                      // 3D 느낌을 위한 box-shadow
                      boxShadow: block.pulled
                        ? '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : '0 2px 4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)',
                      // pulled 블록은 살짝 돌출
                      marginLeft: block.pulled && blockIdx === 0 ? '-6px' : undefined,
                      marginRight: block.pulled && blockIdx === 2 ? '-6px' : undefined,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 받침대 */}
      <div className="w-[140px] h-[6px] bg-[#8b5e3c] rounded-sm mt-1 shadow-[0_3px_8px_rgba(0,0,0,0.4)]" />
    </div>
  );
};

export default JengaTower;
