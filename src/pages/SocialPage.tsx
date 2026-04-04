import { useState, useRef, useCallback } from 'react';
import SocialFeedItem, { type FeedUser } from '../components/features/social/SocialFeedItem';

// ─── 더미 데이터 (각 유저의 타워 정보) ──────────────────────────────
const MOCK_USERS: FeedUser[] = [
  {
    id: 1,
    name: '김민지',
    avatar: '👩',
    statusMessage: '오늘도 견뎌내는 중💦',
    tower: { stability_score: 45, collapsed: false, total_floors: 8 },
    blocks: [
      { floor_index: 0, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 0, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 0, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 2, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 3, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 3, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 4, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 5, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 6, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 7, position_index: 1, block_type: 'emotion-sad', message: '너무 우울한 하루' },
    ],
  },
  {
    id: 2,
    name: '이준호',
    avatar: '🧑',
    statusMessage: '단단히 마음먹자 돌담처럼!',
    tower: { stability_score: 85, collapsed: false, total_floors: 6 },
    blocks: [
      { floor_index: 0, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 0, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 0, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 2, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 2, position_index: 1, block_type: 'emotion-happy', message: '프로젝트 완성!' },
      { floor_index: 2, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 3, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 3, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 4, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 5, position_index: 1, block_type: 'gift', message: '파이팅!' },
    ],
  },
  {
    id: 3,
    name: '박서연',
    avatar: '👧',
    statusMessage: '와르르 멘탈 붕괴 직전...',
    tower: { stability_score: 22, collapsed: true, total_floors: 5 },
    blocks: [
      { floor_index: 0, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 0, position_index: 2, block_type: 'standard', message: '' },
      { floor_index: 1, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 2, position_index: 0, block_type: 'standard', message: '' },
      { floor_index: 2, position_index: 2, block_type: 'emotion-angry', message: '화난다!!' },
      { floor_index: 3, position_index: 1, block_type: 'standard', message: '' },
      { floor_index: 4, position_index: 1, block_type: 'standard', message: '' },
    ],
  },
];
// ──────────────────────────────────────────────────────────────

const SocialPage = () => {
  const [users, setUsers] = useState<FeedUser[]>(MOCK_USERS);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 스크롤 이벤트 디바운싱 없이 바로 인덱스 트래킹
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    
    // 현재 화면에 가장 많이 보이는 슬라이드 인덱스 계산
    const index = Math.round(scrollTop / clientHeight);
    
    if (index !== activeIndex && index >= 0 && index < users.length) {
      setActiveIndex(index);
    }
  }, [activeIndex, users.length]);

  // '토닥토닥' 메시지 전송 로직
  const handleComfort = (userId: number, message: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          // 새 블록을 꼭대기 층에 예쁘게 추가 (임시 로직)
          const highestFloor = u.tower.total_floors;
          const randomPos = Math.floor(Math.random() * 3); // 0, 1, 2 중 하나
          
          return {
            ...u,
            tower: {
              ...u.tower,
              stability_score: Math.min(100, u.tower.stability_score + 10), // 안정도 10 상승!
              total_floors: highestFloor + 1,
            },
            blocks: [
              ...u.blocks,
              {
                floor_index: highestFloor,
                position_index: randomPos,
                block_type: 'gift', // 특별한 분홍색 선물 블록
                message: message,
              },
            ],
          };
        }
        return u;
      })
    );
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-[#121212] relative pb-[60px]" // pb-[60px] removes bottomNav overlap on scroll end
    >
      {users.map((user, index) => {
        const isActive = index === activeIndex;
        // 성능 최적화: 앞/뒤 1개의 슬라이드까지만 미리/뒤로 캔버스 유지 
        // 모바일 사파리 등 WebGL 컨텍스트 16개 초과 방지
        const isRendered = Math.abs(index - activeIndex) <= 1;

        return (
          <SocialFeedItem 
            key={user.id} 
            user={user} 
            isActive={isActive} 
            isRendered={isRendered} 
            onComfort={handleComfort} 
          />
        );
      })}

      {/* 헤더 오버레이 - 스크롤 상관없이 화면 상단 고정 */}
      <div className="fixed top-0 left-0 right-0 z-50 p-5 pt-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <h1 className="text-xl font-bold text-white drop-shadow-md">소셜 (둘러보기)</h1>
      </div>
    </div>
  );
};

export default SocialPage;
