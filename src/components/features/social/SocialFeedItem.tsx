import { useState } from 'react';
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

const avatarImages = [avatar1, avatar2, avatar3, avatar4];

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

  const { tower, blocks, isLoading } = useTowerData(user.id);
  const stabilityScore = tower?.stability_score ?? 100;

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
    <div className="relative w-full h-screen snap-center overflow-hidden snap-always flex-shrink-0 bg-[#F0ECE4]">
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
      <div className="absolute top-[120px] left-6 right-6 z-20 pointer-events-none drop-shadow-md">
        <div className="flex items-center gap-4 mb-2">
          <img src={avatarImages[user.id % avatarImages.length]} alt="아바타" className="w-12 h-12 rounded-full object-cover ring-[3px] ring-white shadow-md ml-2" />
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-800 leading-tight">{user.nickname}님의 타워</h2>
            <p className="text-sm text-slate-600 flex items-center">{user.comment}{user.id === 1 && <img src={cheeIcon} alt="chee" className="w-5 h-5 object-contain" />}</p>
          </div>
        </div>
      </div>

      {/* 안정도 인디케이터 */}
      <div className="absolute left-6 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
        <div className="w-10 h-80 rounded-full overflow-visible bg-slate-300/50 shadow-inner relative flex flex-col justify-end">
          <div
            className={`w-full rounded-full transition-all duration-1000 ${
              stabilityScore <= 30 ? 'bg-red-500 animate-pulse' :
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
          <p className={`text-[14px] font-extrabold ${
            stabilityScore <= 30 ? 'text-red-500' :
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
