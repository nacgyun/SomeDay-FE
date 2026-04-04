import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import JengaTower3D from '../components/features/main/JengaTower3D';
import todakIcon from '../assets/todak.png';

const GuidePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // ─── 온보딩용 가상 데이터 ───────────────────
  const mockStableTower = { stability_score: 97, collapsed: false, total_floors: 10 };
  const mockUnstableTower = { stability_score: 30, collapsed: false, total_floors: 6 };
  
  const mockBlocks = Array.from({ length: 9 }).map((_, i) => ({
    floor_index: Math.floor(i / 3),
    position_index: i % 3,
    block_type: 'STANDARD',
    message: '응원합니다!'
  }));

  const steps = [
    {
      title: '반가워요!\n Someday입니다 ☀️',
      description: '일상을 기록하고 마음을 쌓아 올려\n나만의 견고한 타워를 만들어 볼까요?',
      content: (
        <div className="relative w-full h-[240px] flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[100px] drop-shadow-2xl"
          >
            ☀️
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
             <div className="w-32 h-2 bg-black/5 blur-xl rounded-full" />
          </div>
        </div>
      ),
    },
    {
      title: '감정에 따라 변화하는\n실시간 타워 시스템 📈',
      description: '작성한 일기 속 감정에 따라 타워의 모양과\n안정도가 역동적으로 변화합니다.',
      content: (
        <div className="flex gap-2 w-full h-[300px] mt-4">
          <div className="flex-1 flex flex-col items-center bg-white/40 backdrop-blur-sm rounded-[32px] p-4 border border-white/40 shadow-sm">
            <div className="h-full w-full relative">
              <JengaTower3D tower={mockStableTower} blocks={mockBlocks} />
            </div>
            <span className="text-[13px] font-black text-emerald-500 mt-3 drop-shadow-sm">안정적 (97%)</span>
          </div>
          <div className="flex-1 flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-[32px] p-4 border border-white/20 shadow-sm">
            <div className="h-full w-full relative">
              <JengaTower3D tower={mockUnstableTower} blocks={mockBlocks.slice(0, 5)} />
            </div>
            <span className="text-[13px] font-black text-red-500 mt-3 drop-shadow-sm">불안정 (30%)</span>
          </div>
        </div>
      ),
    },
    {
      title: '서로를 보듬는 따스한 손길,\n토닥토닥 💖',
      description: '다른 이에게 응원을 보내보세요.\n응원을 받으면 분홍색 선물 블록이 쌓입니다!',
      content: (
        <div className="flex flex-col items-center gap-8 py-8 w-full">
          <div className="relative">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 bg-white rounded-[40px] shadow-xl flex items-center justify-center p-6 border border-white/50"
            >
              <img src={todakIcon} alt="토닥토닥" className="w-full h-full object-contain" />
            </motion.div>
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-pink-500 rounded-2xl shadow-lg flex items-center justify-center text-2xl border-2 border-white"
            >
               🎁
            </motion.div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/40 shadow-sm text-center">
            <p className="text-[14px] text-[#5a4a3a] font-bold">
              일일 전송 제한: <span className="text-[#f97316] text-lg ml-1">3회</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">따뜻한 마음은 소중히 나눠주세요.</p>
          </div>
        </div>
      ),
    },
    {
      title: '마음을 쌓아 올릴\n준비가 되었나요? ✨',
      description: '이제 당신의 소중한 하루를 기록하고\n나만의 튼튼한 타워를 관리해 보세요.',
      content: (
        <div className="flex flex-col items-center justify-center py-6 w-full">
           <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-9xl filter drop-shadow-2xl"
              >
                🏗️
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-4 bg-black/10 blur-xl rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2"
              />
           </div>
          
          <button
            onClick={() => navigate('/main?openDiary=true')}
            className="w-full py-4 rounded-[24px] font-black text-lg bg-gradient-to-r from-[#8b5e3c] to-[#a8774d] text-white shadow-2xl shadow-brand-brown/30 active:scale-95 transition-all cursor-pointer border-none mb-4"
          >
            나의 첫 타워 쌓으러 가기
          </button>
          <p className="text-slate-400 text-[13px] font-bold">언제든 물음표 아이콘을 눌러 가이드를 확인하세요!</p>
        </div>
      ),
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="relative w-full h-screen bg-[#F0ECE4] overflow-hidden flex flex-col items-center font-sans">
      {/* 배경 장식 원 (AuthLayout 스타일 유지) */}
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.2] -top-[100px] -right-[100px] bg-[radial-gradient(circle,#fde68a,transparent)] animate-float pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.2] -bottom-[80px] -left-[80px] bg-[radial-gradient(circle,#fbcfe8,transparent)] animate-float-reverse pointer-events-none" />
      
      {/* 메인 컨테이너 (최대 440px 고정) */}
      <div className="relative z-10 w-full max-w-[440px] h-full flex flex-col px-8">
        
        {/* 상단 프로그레스 바 */}
        <div className="mt-16 flex gap-2 justify-center shrink-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-12 bg-[#B6754C]' : i < step ? 'w-4 bg-[#B6754C]/40' : 'w-4 bg-slate-200'}`}
            />
          ))}
        </div>

        {/* 본문 콘텐츠 */}
        <div className="flex-1 flex flex-col justify-center py-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-10 w-full">
                <h1 className="text-[26px] font-black text-[#4a3b32] mb-5 whitespace-pre-line tracking-tight leading-[1.3]">
                  {steps[step].title}
                </h1>
                <p className="text-[16px] font-bold text-slate-500/80 whitespace-pre-line leading-relaxed tracking-tight">
                  {steps[step].description}
                </p>
              </div>

              <div className="w-full flex justify-center mb-6">
                {steps[step].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 하단 내비게이션 */}
        <div className="pb-14 pt-4 flex shrink-0">
          {step < steps.length - 1 ? (
            <div className="flex w-full gap-4 items-center">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className={`flex-1 py-4 rounded-[20px] font-bold text-[15px] transition-all cursor-pointer border-none bg-white text-slate-400 shadow-sm active:scale-95 ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                이전으로
              </button>
              
              <button
                onClick={handleNext}
                className="flex-[2] py-4 rounded-[20px] font-black text-[16px] text-white bg-[#B6754C] shadow-xl shadow-brand-brown/20 active:scale-95 transition-all cursor-pointer border-none"
              >
                다음으로
              </button>
            </div>
          ) : (
            <div className="w-full invisible h-12" /> // 레이아웃 유지용
          )}
        </div>
      </div>

      {/* 건너뛰기 버튼 */}
      {step < steps.length - 1 && (
        <button
          onClick={() => navigate('/main')}
          className="fixed top-14 right-6 z-50 text-[14px] font-black text-slate-400/60 hover:text-slate-400 transition-colors cursor-pointer border-none bg-transparent"
        >
          Skip
        </button>
      )}
    </div>
  );
};

export default GuidePage;
