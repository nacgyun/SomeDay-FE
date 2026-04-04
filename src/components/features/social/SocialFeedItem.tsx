import { useState } from 'react';
import JengaTower3D from '../main/JengaTower3D';
import { AnimatePresence, motion } from 'framer-motion';
import { useTowerData } from '../../../hooks/useTowerData';
import type { SocialUser } from '../../../hooks/useSocialFeed';

interface SocialFeedItemProps {
  user: SocialUser;
  isActive: boolean;
  isRendered: boolean;
  onComfort: (userId: number, message: string) => void;
}

const SocialFeedItem = ({ user, isActive, isRendered, onComfort }: SocialFeedItemProps) => {
  const [showComfortModal, setShowComfortModal] = useState(false);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);

  // 💡 useSocialFeed에서 setQueryData를 해두었으므로 로딩 없이 즉시 렌더링됨
  const { tower, blocks, isLoading } = useTowerData(user.id);

  const stabilityScore = tower?.stability_score ?? 100;
  const isStable = stabilityScore >= 60;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onComfort(user.id, message);
    setMessage('');
    setShowComfortModal(false);

    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 2500);
  };

  return (
    <div className={`relative w-full h-screen snap-center overflow-hidden snap-always flex-shrink-0 bg-[#F0ECE4]`}>
      {isRendered && (
        <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
          {isLoading || !tower ? (
            <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-3 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin" /></div>
          ) : (
            <JengaTower3D tower={tower} blocks={blocks} />
          )}
        </div>
      )}

      {/* 유저 정보 */}
      <div className="absolute top-[100px] left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="text-4xl drop-shadow-md">{user.avatarEmoji}</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 drop-shadow-sm">{user.nickname}</h2>
            <p className="text-sm text-slate-500 font-medium">{user.comment}</p>
          </div>
        </div>
      </div>

      {/* 안정도 바 */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-2 h-32 rounded-full bg-slate-300/50 shadow-inner overflow-hidden">
          <motion.div
            className={`w-full ${isStable ? 'bg-brand-purple' : 'bg-slate-400'}`}
            initial={{ height: 0 }}
            animate={{ height: `${stabilityScore}%` }}
            transition={{ duration: 1, type: 'spring' }}
            style={{ marginTop: 'auto' }}
          />
        </div>
        <span className="text-xs font-black text-slate-800">{stabilityScore}%</span>
      </div>

      {/* 토닥토닥 버튼 */}
      <div className="absolute bottom-32 right-6 z-30">
        <button onClick={() => setShowComfortModal(true)} className="flex flex-col items-center gap-2 group">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-xl group-active:scale-95 transition-transform">
            <span className="text-3xl">💖</span>
          </div>
          <span className="text-[12px] font-bold text-slate-500">토닥토닥</span>
        </button>
      </div>

      {/* 파티클 및 모달 생략 (동일) */}
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
            💖
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
              className="relative w-full max-w-[400px] bg-white rounded-3xl p-7 shadow-2xl border border-slate-100"
            >
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">따뜻한 마음 전하기</h3>
              <p className="text-sm text-slate-500 mb-6">{user.nickname}님에게 응원의 메시지를 남겨주세요.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  autoFocus
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="응원의 한마디를 적어보세요..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 outline-none focus:border-brand-purple/50 transition-colors shadow-inner"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowComfortModal(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border-none"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-purple to-brand-blue shadow-lg shadow-brand-purple/20 active:scale-95 transition-transform cursor-pointer border-none"
                  >
                    보내기 💖
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