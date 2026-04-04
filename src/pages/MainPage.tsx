import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTowerData } from '../hooks/useTowerData';
import { JengaIcon } from '../components/icons/JengaIcon';
import JengaTower3D from '../components/features/main/JengaTower3D';
import DiaryModal from '../components/features/main/DiaryModal';

type ModalMode = 'diary' | 'survey';

const MainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();


  const { tower, blocks, isLoading, isError } = useTowerData(user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('diary');
  const [showWarning, setShowWarning] = useState(false);
  const hasShownWarning = useRef(false);
  const [showBubble, setShowBubble] = useState(false);

  // 젠가 블록이 다 떨어진 후 말풍선 표시
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      const delay = blocks.length * 80 + 1500;
      const timer = setTimeout(() => setShowBubble(true), delay);
      return () => clearTimeout(timer);
    }
  }, [blocks]);

  // 튜토리얼 등에서 넘어온 경우 자동 일기 모달 열기
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('openDiary') === 'true') {
      openModal('diary');
      // 처리 후 파라미터 제거
      navigate('/main', { replace: true });
    }
  }, [search, navigate]);

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const score = tower?.stability_score ?? 100;
  const isStable = !tower || score >= 60;
  const userName = user?.nickname || user?.name || '사용자';

  useEffect(() => {
    const hideDay = localStorage.getItem('hideStabilityWarningDay');
    const today = new Date().toDateString();

    if (score <= 30 && !hasShownWarning.current && !isLoading && tower && hideDay !== today) {
      const timer = setTimeout(() => {
        setShowWarning(true);
        hasShownWarning.current = true;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [score, isLoading, tower]);

  const handleHideToday = () => {
    localStorage.setItem('hideStabilityWarningDay', new Date().toDateString());
    setShowWarning(false);
  };

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
        <button className="bg-slate-200 px-4 py-2 rounded-lg text-slate-700 pointer-events-auto" onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  const bgGradient = isStable
    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent'
    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200/40 via-transparent to-transparent';

  return (
    <>
      <div className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 bg-[#F0ECE4] ${bgGradient}`}>

        {tower && blocks && blocks.length > 0 ? (
          <>
            <JengaTower3D tower={tower} blocks={blocks} />
            {showBubble && (
              <div className="absolute top-[18%] inset-x-0 flex justify-center z-20 pointer-events-none">
                <div 
                  className="relative bg-white/90 backdrop-blur-sm rounded-3xl px-10 py-6 shadow-lg border border-slate-100"
                  style={{
                    animation: 'dropIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, bubbleFloat 4s ease-in-out 1.2s infinite',
                  }}
                >
                  <p className="text-[18px] font-cute font-bold text-[#5a4a3a] text-center">
                    {isStable ? <>밤새 코딩했지만<br/>커피 한 잔이면 아직 버틸 수 있어요 ☕😎</> : <>무박 2일 해커톤...<br/>멘탈이랑 체력이 동시에 무너지는 중 😴</>}
                  </p>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white/90 border-r border-b border-slate-100 rotate-45" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center px-8 text-center pointer-events-none">
            <div className="w-24 h-24 bg-white/40 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm backdrop-blur-sm border border-white/20">
              🧡
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              반가워요, {userName}님!
            </h3>
            <p className="text-slate-500 text-[15px] leading-relaxed break-keep">
              아직 쌓인 마음이 없네요.<br /> 오늘의 일기를 쓰고 나만의 튼튼한<br /> 마음 타워를 처음으로 만들어볼까요?
            </p>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 z-10 p-5 pt-12 flex flex-col pointer-events-none">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl font-cute font-bold text-[#4a3b32] leading-tight mb-4">
              {isStable ? '생글생글 웃고있는' : '휴... 기운없는'}<br />
              {userName}님의 타워
            </h2>
            <div className="flex items-center gap-3 pointer-events-auto bg-transparent">
              {/* 가이드 아이콘 */}
              <button 
                onClick={() => navigate('/guide')} 
                className="bg-white/40 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center border border-white/20 cursor-pointer transition-all hover:bg-white/60 active:scale-90 shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a4a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              
              {/* 알림 아이콘 */}
              <button className="bg-white/40 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center border border-white/20 cursor-pointer transition-all hover:bg-white/60 active:scale-90 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isStable ? '#f97316' : '#334155'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {tower && (
          <div className="absolute left-5 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
            <div className="w-10 h-80 rounded-full overflow-visible bg-slate-300/50 shadow-inner relative flex flex-col justify-end">
              <div
                className={`w-full rounded-full transition-all duration-1000 shadow-sm ${
                  score <= 30 ? 'bg-red-500 animate-pulse' :
                  score <= 60 ? 'bg-amber-400' :
                  'bg-emerald-400'
                }`}
                style={{
                  height: `${score}%`,
                  filter: score <= 30
                    ? 'drop-shadow(0 0 10px rgba(239,68,68,0.9))'
                    : score <= 60
                    ? 'drop-shadow(0 0 6px rgba(251,191,36,0.8))'
                    : 'drop-shadow(0 0 6px rgba(52,211,153,0.8))',
                }}
              />
            </div>
            <div className="mt-3 text-center">
              <p className={`text-[14px] font-extrabold ${
                score <= 30 ? 'text-red-500' :
                score <= 60 ? 'text-amber-500' :
                'text-emerald-500'
              }`}>{score}%</p>
              <p className="text-[11px] font-bold text-slate-400">안정도</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-[110px] left-0 right-0 z-50 flex justify-center pointer-events-none">
          <button
            onClick={() => openModal('diary')}
            className="pointer-events-auto w-[90%] max-w-[400px] flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-[16px] border-none shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#8b5e3c] to-[#a8774d] text-white cursor-pointer"
          >
            <JengaIcon color="#b5b1afff" className="w-5 h-5" />
            <span>AI와 젠가쌓기</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWarning(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-[340px] bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mb-5 shadow-inner">😟</div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-3 break-keep">요즘 많이 불안하신 거 같아요!</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed mb-8 break-keep">미션을 통해 여유를 찾고<br />마음을 다시 쌓아보아요!</p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={() => navigate('/mission')} className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-orange to-brand-orange-dark shadow-lg shadow-brand-orange/20 active:scale-95 transition-transform cursor-pointer border-none">미션 하러 가기 🏃‍♂️</button>
                <div className="flex w-full gap-2 mt-1">
                  <button onClick={() => setShowWarning(false)} className="flex-1 py-3 rounded-2xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border-none text-sm">확인</button>
                  <button onClick={handleHideToday} className="flex-1 py-3 rounded-2xl font-bold text-slate-400 bg-transparent hover:bg-slate-50 transition-colors cursor-pointer border-none text-[11px] underline underline-offset-4">오늘 하루 보지 않기</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DiaryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} />
    </>
  );
};

export default MainPage;
