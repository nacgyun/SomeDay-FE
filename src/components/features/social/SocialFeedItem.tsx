import { useState } from 'react';
import type { TowerData, BlockData } from '../main/JengaTower3D';
import JengaTower3D from '../main/JengaTower3D';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '../../ui/Button';

export interface FeedUser {
  id: number;
  name: string;
  avatar: string;
  statusMessage: string;
  tower: TowerData;
  blocks: BlockData[];
}

interface SocialFeedItemProps {
  user: FeedUser;
  isActive: boolean;
  isRendered: boolean; // active +- 1 일 때만 렌더링
  onComfort: (userId: number, message: string) => void;
}

const SocialFeedItem = ({ user, isActive, isRendered, onComfort }: SocialFeedItemProps) => {
  const [showComfortModal, setShowComfortModal] = useState(false);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([]);

  // 소셜 피드용 어두운 푸른밤 배경 또는 유저 상태에 따른 배경 (메인과 다르게 그라데이션)
  const isStable = user.tower.stability_score >= 60;
  const bgGradient = isStable
    ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a3b4c] via-[#1a232c] to-[#0d1217]' // 밤하늘 느낌의 파란 그레이
    : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3a2c3a] via-[#241a24] to-[#120d12]'; // 보랏빛/붉은기 있는 어두운 밤

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onComfort(user.id, message);
    setMessage('');
    setShowComfortModal(false);

    // 파티클 생성 로직
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40, // 뷰포트 중앙 기준 좌우 오프셋 퍼센트
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // 2초 뒤 파티클 제거
    setTimeout(() => {
      setParticles([]);
    }, 2500);
  };

  return (
    <div className={`relative w-full h-screen snap-center overflow-hidden snap-always flex-shrink-0 ${bgGradient}`}>
      {/* 3D 타워 캔버스 (isRendered가 참일때만 마운트) */}
      {isRendered ? (
        <div className="absolute inset-0 z-0 transition-opacity duration-700" style={{ opacity: isActive ? 1 : 0.4 }}>
          <JengaTower3D tower={user.tower} blocks={user.blocks} />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* 렌더링되지 않을 때의 플레이스홀더 */}
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin opacity-20"></div>
        </div>
      )}

      {/* 좌측 유저 정보 및 안정도 */}
      <div className="absolute top-[80px] left-5 z-20 pointer-events-none drop-shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">{user.avatar}</span>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">{user.name}님의 타워</h2>
            <p className="text-sm text-white/75">{user.statusMessage}</p>
          </div>
        </div>
      </div>

      {/* 안정도 인디케이터 */}
      <div className="absolute left-5 top-[55%] -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
        <div className="w-2.5 h-32 rounded-full overflow-hidden bg-white/10">
          <div
            className={`w-full rounded-full transition-all duration-1000 ${isStable ? 'bg-[#90e0ef]' : 'bg-[#f4a261]'}`}
            style={{ height: `${user.tower.stability_score}%`, marginTop: `${100 - user.tower.stability_score}%` }}
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-[12px] font-extrabold text-white/90">{user.tower.stability_score}%</p>
          <p className="text-[10px] font-bold text-white/50">안정도</p>
        </div>
      </div>

      {/* 우측 하단 토닥토닥 위로 버튼 */}
      <div className="absolute bottom-[110px] right-5 z-20">
        <button
          onClick={() => setShowComfortModal(true)}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div className="w-14 h-14 bg-gradient-to-tr from-[#ffb5a7] to-[#fcd5ce] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,181,167,0.4)] transition-transform group-hover:scale-110 group-active:scale-95">
            <span className="text-2xl">💖</span>
          </div>
          <span className="text-[11px] font-bold text-white/80 drop-shadow-md">토닥토닥</span>
        </button>
      </div>

      {/* 메시지 작성 모달 (BottomSheet 형태) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, x: `${p.x}vw` }}
            animate={{ opacity: [0, 1, 1, 0], y: -300, scale: [0.5, 1.2, 1], rotate: [0, -20, 20, 0] }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -ml-4 z-40 pointer-events-none drop-shadow-lg"
          >
            <span className="text-4xl">💖</span>
          </motion.div>
        ))}

        {showComfortModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowComfortModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-[500px] bg-[#1e1e24] rounded-t-[32px] p-6 pb-12 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4">
                {user.name}님에게 위로의 블록 보내기
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="따뜻한 한마디를 적어주세요..."
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-[#ffb5a7] transition-all"
                  autoFocus
                />
                <Button type="submit" variant="primary" className="!bg-gradient-to-r !from-[#ffb5a7] !to-[#fcd5ce] !text-[#4a3b32] text-lg py-4 shadow-xl">
                  위로 보내기 💖
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialFeedItem;
