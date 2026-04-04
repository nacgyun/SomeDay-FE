import { useState, useEffect } from 'react';
import JengaTower3D from '../main/JengaTower3D';
import { AnimatePresence, motion } from 'framer-motion';
import { useTowerData } from '../../../hooks/useTowerData';
import type { SocialUser } from '../../../hooks/useSocialFeed';
import todakIcon from '../../../assets/todak.png';
import avatar1 from '../../../assets/1.png';
import avatar2 from '../../../assets/2.png';
import avatar3 from '../../../assets/3.png';
import avatar4 from '../../../assets/4.png';
import cheeIcon from '../../../assets/chee.png';
import LoadingOverlay from '../../ui/LoadingOverlay';

const avatarImages = [avatar1, avatar2, avatar3, avatar4];

interface SocialFeedItemProps {
  user: SocialUser;
  isActive: boolean;
  isRendered: boolean;
  onComfort: (userId: number, message: string) => Promise<void>;
}

const SocialFeedItem = ({ user, isActive, isRendered, onComfort }: SocialFeedItemProps) => {
  const [showComfortModal, setShowComfortModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);

  const { tower, blocks, isLoading } = useTowerData(user.id);
  const stabilityScore = tower?.stability_score ?? 100;
  const isStable = stabilityScore >= 60;
  const [showBubble, setShowBubble] = useState(false);

  // 젠가 블록이 다 떨어진 후 말풍선 표시
  useEffect(() => {
    if (isActive && blocks && blocks.length > 0) {
      setShowBubble(false);
      const delay = blocks.length * 80 + 500;
      const timer = setTimeout(() => setShowBubble(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isActive, blocks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await onComfort(user.id, message);
      setMessage('');
      setShowComfortModal(false);

      // 성공 파티클 효과
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 - 40,
      }));
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => setParticles([]), 2500);
    } catch (error) {
      console.error('Failed to send comfort message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-full h-screen snap-center overflow-hidden snap-always flex-shrink-0 bg-[#F0ECE4]">
      {/* 젠가 타워 로딩 오버레이 (현재 활성화된 카드만) */}
      {isActive && (isLoading || !tower) && (
        <LoadingOverlay message={`${user.nickname}님의 마음 타워를 세우는 중...`} />
      )}

      {isRendered && (
        <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
          {!tower ? (
            <div className="flex items-center justify-center h-full">
              {/* 타워 데이터가 아예 없을 때의 빈 공간 처리 */}
            </div>
          ) : (
            <JengaTower3D tower={tower} blocks={blocks} />
          )}
        </div>
      )}

      {/* 말풍선 - 젠가 떨어진 후 등장 */}
      {isActive && showBubble && tower && (
        <div className="absolute top-[25%] inset-x-0 flex justify-center z-20 pointer-events-none">
          <div 
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-lg border border-slate-100"
            style={{
              animation: 'dropIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, bubbleFloat 4s ease-in-out 1.2s infinite',
            }}
          >
            <p className="text-[15px] font-cute font-bold text-[#5a4a3a] text-center">
              {(() => {
                const stableMessages = [
                  '탄탄한 마음 타워네요 ✨',
                  '오늘도 잘 버티고 있어요 💪',
                  '마음이 단단하네요 🏗️',
                  '든든한 하루를 보내고 있군요 🌟',
                ];
                const unstableMessages = [
                  <>마음이 흔들리고 있어요...<br/>토닥토닥 해주세요 🍀</>,
                  <>조금 힘든 하루인가 봐요<br/>응원 한마디 어때요? 💌</>,
                  <>타워가 위태위태해요...<br/>따뜻한 말 한마디 부탁해요 🫶</>,
                  <>마음이 무거운 날이네요<br/>힘내라고 말해주세요 🌈</>,
                ];
                const msgs = isStable ? stableMessages : unstableMessages;
                return msgs[user.id % msgs.length];
              })()}
            </p>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-r border-b border-slate-100 rotate-45" />
          </div>
        </div>
      )}

      {/* 유저 정보 */}
      <div className="absolute top-[120px] left-6 right-6 z-20 pointer-events-none drop-shadow-md">
        <div className="flex items-center gap-4 mb-2">
          <img src={avatarImages[user.id % avatarImages.length]} alt="아바타" className="w-12 h-12 rounded-full object-cover ring-[3px] ring-white shadow-md ml-2" />
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-cute font-bold text-[#4a3b32] leading-tight">{user.nickname}님의 타워</h2>
            <p className="text-sm font-cute font-bold text-[#8b7b6b] flex items-center">{user.comment}{user.id === 1 && <img src={cheeIcon} alt="chee" className="w-5 h-5 object-contain" />}</p>
          </div>
        </div>
      </div>

      {/* 안정도 인디케이터 */}
      <div className="absolute left-6 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
        <div className="w-10 h-80 rounded-full overflow-visible bg-slate-300/50 shadow-inner relative flex flex-col justify-end">
          <div
            className={`w-full rounded-full transition-all duration-1000 ${stabilityScore <= 30 ? 'bg-red-500 animate-pulse' :
                stabilityScore <= 60 ? 'bg-amber-400' :
                  'bg-emerald-400'
              }`}
            style={{
              height: `${stabilityScore}%`,
              filter: stabilityScore <= 30
                ? 'drop-shadow(0 0 10px rgba(239,68,68,0.9))'
                : stabilityScore <= 60
                  ? 'drop-shadow(0 0 6px rgba(251,191,36,0.8))'
                  : 'drop-shadow(0 0 6px rgba(52,211,153,0.8))',
            }}
          />
        </div>
        <div className="mt-3 text-center">
          <p className={`text-[14px] font-extrabold ${stabilityScore <= 30 ? 'text-red-500' :
              stabilityScore <= 60 ? 'text-amber-500' :
                'text-emerald-500'
            }`}>{stabilityScore}%</p>
          <p className="text-[11px] font-bold text-slate-400">안정도</p>
        </div>
      </div>

      {/* 토닥토닥 버튼 */}
      <div className="absolute bottom-[110px] right-6 z-20">
        <button
          onClick={() => setShowComfortModal(true)}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 overflow-hidden">
            <div className="absolute inset-0 rounded-full bg-[#d4edda] ring-2 ring-[#5a9e6f]/30" />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[conic-gradient(transparent_0deg,rgba(255,255,255,0.7)_60deg,transparent_120deg)] group-hover:animate-[border-shine_1.2s_linear_infinite]" />
            <img src={todakIcon} alt="토닥토닥" className="w-9 h-9 object-contain relative z-10" />
          </div>
          <span className="text-[11px] font-bold text-[#5a9e6f] drop-shadow-sm">토닥토닥</span>
        </button>
      </div>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{ y: -120, opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-40 right-10 text-3xl z-50 pointer-events-none"
            style={{ x: p.x }}
          >
            <img src={todakIcon} alt="토닥토닥" className="w-10 h-10 object-contain" />
          </motion.div>
        ))}

        {showComfortModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComfortModal(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-[400px] bg-white rounded-3xl p-7 shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* 전송 중 애니메이션 오버레이 */}
              {isSending && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
                  <div className="relative mb-4">
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-brand-green/20 blur-md rounded-full" />
                    <img src={todakIcon} alt="토닥토닥" className="w-16 h-16 object-contain animate-patting" />
                  </div>
                  <p className="text-slate-800 font-extrabold text-lg tracking-tight">
                    마음을 전달하는 중...
                  </p>
                  <div className="mt-2 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <h3 className="text-xl font-extrabold text-slate-800 mb-2">따뜻한 마음 전하기</h3>
              <p className="text-sm text-slate-500 mb-6">{user.nickname}님에게 응원의 메시지를 남겨주세요.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="relative group">
                  <textarea
                    autoFocus
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="응원의 한마디를 적어보세요..."
                    rows={3}
                    className="w-full bg-[#FDFCFB] border border-slate-200/60 rounded-[24px] px-6 py-5 text-slate-800 outline-none focus:ring-4 focus:ring-[#f97316]/10 focus:border-[#f97316]/20 transition-all shadow-sm placeholder:text-slate-300 font-medium resize-none text-[15px] leading-relaxed"
                  />
                  <div className="absolute right-5 bottom-4 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">Warm Message</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowComfortModal(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border-none text-sm"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 rounded-2xl font-extrabold text-white bg-[#f97316] shadow-lg shadow-brand-orange-dark/20 active:scale-95 transition-all cursor-pointer border-none"
                  >
                    토닥토닥
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialFeedItem;
