import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTowerData } from '../hooks/useTowerData';
import { JengaIcon } from '../components/icons/JengaIcon';
import JengaTower3D from '../components/features/main/JengaTower3D';
import DiaryModal from '../components/features/main/DiaryModal';

type ModalMode = 'diary' | 'survey';

const MainPage = () => {
  const { user } = useAuth();

  // Custom hook을 통해 타워/블록 데이터 패치 (user.id 기반)
  const { tower, blocks, isLoading, isError } = useTowerData(user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('diary');

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const userName = user?.nickname || user?.name || '사용자';

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#F0ECE4] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 text-sm font-semibold">타워를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen bg-[#F0ECE4] flex flex-col items-center justify-center">
        <p className="text-brand-red text-sm font-semibold mb-2">데이터를 불러오는 데 실패했습니다.</p>
        <button className="bg-slate-200 px-4 py-2 rounded-lg text-slate-700" onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  const score = tower?.stability_score ?? 0;
  const isStable = score >= 60;

  // 안정도에 따른 배경색 클래스
  const bgGradient = isStable
    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent'
    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200/40 via-transparent to-transparent';

  return (
    <>
      <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 bg-[#F0ECE4] ${bgGradient}`}>

        {/* 3D 젠가 타워 배경 (Absolute로 전체 화면 점유) */}
        {tower && blocks && blocks.length > 0 ? (
          <JengaTower3D tower={tower} blocks={blocks} />
        ) : (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl mb-4">🧱</span>
            <p className="text-slate-500 font-bold text-lg">첫 번째 마음 블록을 쌓아보세요!</p>
          </div>
        )}

        {/* 상단 UI 오버레이 */}
        <div className="absolute top-0 left-0 right-0 z-10 p-5 pt-12 flex flex-col pointer-events-none">
          <div className="flex justify-between items-start mb-2">
            <h2 className={`text-[21px] font-bold leading-tight mb-4 ${isStable ? 'text-brand-orange-dark/80' : 'text-slate-700'}`}>
              {isStable ? '생글생글 웃고있는' : '휴... 기운없는'}<br />
              {userName}님의 타워
            </h2>
            <button className="pointer-events-auto bg-transparent border-none cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isStable ? '#f97316' : '#334155'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>



          {/* <div className="flex gap-2">
            <button className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full ${isStable ? 'bg-white shadow-sm text-brand-orange-dark border border-brand-orange/20' : 'bg-slate-200 text-slate-700 backdrop-blur-md'} font-bold text-sm border-none cursor-pointer`}>
              📦 블록 쌓기
            </button>
          </div> */}
        </div>

        {/* 측면 스트레스/안정도 인디케이터 (목업 참조) */}
        <div className="absolute left-5 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
          <div className="w-2.5 h-32 rounded-full overflow-hidden bg-slate-300/50 shadow-inner">
            {/* Score 만큼 바의 높이를 채움. (예: 55%면 높이가 55%이며 아래에서부터 차오름) */}
            <div
              className={`w-full rounded-full transition-all duration-1000 ${isStable ? 'bg-brand-orange shadow-sm' : 'bg-slate-400'}`}
              style={{ height: `${score}%`, marginTop: `${100 - score}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <p className="text-[12px] font-extrabold text-slate-800">
              {score}%
            </p>
            <p className="text-[10px] font-bold text-slate-500">
              안정도
            </p>
          </div>
        </div>

        {/* 하단 일기 버튼 */}
        <div className="absolute bottom-[90px] left-0 right-0 z-50 flex justify-center pointer-events-none">
          <button
            onClick={() => openModal('diary')}
            className="pointer-events-auto w-[90%] max-w-[400px] flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-[16px] border-none shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#8b5e3c] to-[#a8774d] text-white cursor-pointer"
          >
            <JengaIcon color="#b5b1afff" className="w-5 h-5" />
            <span>AI와 젠가쌓기</span>
          </button>
        </div>
      </div>

      <DiaryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} />
    </>
  );
};

export default MainPage;
