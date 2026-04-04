import { useState } from 'react';

import JengaTower3D, { type TowerData, type BlockData } from '../components/features/main/JengaTower3D';
import DiaryModal from '../components/features/main/DiaryModal';

const USER = {
  name: '민지',
  avatar: '😊',
};

const TOWER: TowerData = {
  stability_score: 55, // 60 미만이면 배색이 어두워지고 흔들림
  collapsed: false,
  total_floors: 12,
};

function buildBlocks(): BlockData[] {
  const SPECIAL: Record<string, string> = {
    '2-1': 'stress',
    '4-0': 'anxiety',
    '6-2': 'sadness',
    '8-1': 'anger',
    '10-0': 'fatigue',
  };
  const PULLED = new Set(['3-1', '5-2', '7-0', '9-2', '11-1']);
  const blocks: BlockData[] = [];
  for (let floor = 0; floor < TOWER.total_floors; floor++) {
    for (let pos = 0; pos < 3; pos++) {
      const key = `${floor}-${pos}`;
      if (PULLED.has(key)) continue;
      blocks.push({
        floor_index: floor,
        position_index: pos,
        block_type: SPECIAL[key] ?? 'standard',
        message: '',
      });
    }
  }
  return blocks;
}

const BLOCKS = buildBlocks();
type ModalMode = 'diary' | 'survey';

const MainPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('diary');

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const isStable = TOWER.stability_score >= 60;

  // 안정도에 따른 배경색 클래스 (Framer 3D 타워 레이아웃용)
  const bgGradient = isStable
    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#95d5b2]/40 via-[#d8f3dc]/10 to-[#121212]' // 밝은 민트 -> 다크 테마 배경에 맞춰 변경 (목업 참조)
    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#6c757d]/40 via-[#495057]/20 to-[#121212]'; // 차콜 그레이

  return (
    <>
      <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 bg-[#1e1e24] ${bgGradient}`}>
        
        {/* 3D 젠가 타워 배경 (Absolute로 전체 화면 점유) */}
        <JengaTower3D tower={TOWER} blocks={BLOCKS} />

        {/* 상단 UI 오버레이 (버튼/라벨) */}
        <div className="absolute top-0 left-0 right-0 z-10 p-5 pt-12 flex flex-col pointer-events-none">
          {/* 상단 D-10 & 알림 아이콘 UI */}
          <div className="flex justify-between items-start mb-2">
            <h1 className={`text-4xl font-extrabold tracking-tighter ${isStable ? 'text-brand-green-dark' : 'text-white/90'}`}>
              D-10
            </h1>
            <button className="pointer-events-auto bg-transparent border-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isStable ? '#2d6a4f' : '#ffffff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
          
          <h2 className={`text-[21px] font-bold leading-tight mb-4 ${isStable ? 'text-brand-green-dark/80' : 'text-white/80'}`}>
            {isStable ? '생글생글 웃고있는' : '휴... 기운없는'}<br />
            {USER.name}님의 타워
          </h2>

          <div className="flex gap-2">
            <button className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full ${isStable ? 'bg-white shadow-sm text-brand-green-dark' : 'bg-white/20 text-white backdrop-blur-md'} font-bold text-sm border-none`}>
              📦 블록 쌓기
            </button>
          </div>
        </div>

        {/* 측면 스트레스/안정도 인디케이터 (목업 참조) */}
        <div className="absolute left-5 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
             <div className="w-2.5 h-32 rounded-full overflow-hidden bg-white/20">
                {/* Score 만큼 바의 높이를 채움. (예: 55%면 높이가 55%이며 아래에서부터 차오름) */}
                <div 
                  className={`w-full rounded-full transition-all duration-1000 ${isStable ? 'bg-[#95d5b2]' : 'bg-[#64b5f6]'}`} 
                  style={{ height: `${TOWER.stability_score}%`, marginTop: `${100 - TOWER.stability_score}%` }} 
                />
             </div>
             <div className="mt-2 text-center">
               <p className="text-[12px] font-extrabold text-white/90">
                 {TOWER.stability_score}%
               </p>
               <p className="text-[10px] font-bold text-white/60">
                 안정도
               </p>
             </div>
        </div>

        {/* 하단 CTA (일기/설문 작성) - BottomNav 위쪽 */}
        <div className="absolute bottom-[24px] left-0 right-0 z-40 px-5 pointer-events-none">
          <button
            onClick={() => openModal('diary')}
            className={`pointer-events-auto w-full flex items-center justify-center gap-2.5 py-[18px] rounded-[18px] font-bold text-[16px] border-none shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-[#8b5e3c] to-[#a8774d] text-white`}
          >
            <span className="text-[18px]">✏️</span>
            오늘 일기 · 마음 살펴보기
          </button>
        </div>
      </div>

      <DiaryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} />
    </>
  );
};

export default MainPage;
