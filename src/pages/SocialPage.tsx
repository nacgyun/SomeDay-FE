import { useState, useRef, useCallback, useEffect } from 'react';
import SocialFeedItem from '../components/features/social/SocialFeedItem';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/layout/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const SocialPage = () => {
  const { user: currentUser } = useAuth();
  const { users, isLoading, fetchNextUser } = useSocialFeed();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 초기 데이터 로드
  useEffect(() => {
    if (users.length === 0) fetchNextUser();
  }, [fetchNextUser, users.length]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);

    if (index !== activeIndex && index >= 0 && index < users.length) {
      setActiveIndex(index);
      
      // 💡 마지막 아이템에 도달하면 다음 랜덤 유저를 하나 더 불러옴
      if (index === users.length - 1 && !isLoading) {
        fetchNextUser();
      }
    }
  }, [activeIndex, users.length, isLoading, fetchNextUser]);

  const handleComfort = async (userId: number, message: string) => {
    if (!currentUser) return;

    try {
      // 1. 실제 API 호출: POST /api/cheer-messages
      await api.post('/api/cheer-messages', {
        senderId: currentUser.id,
        receiverId: userId,
        cheerType: 0, // 기본 응원
        message: message,
      });

      // 2. 💡 캐시를 즉시 업데이트하여 UI에 즉시 반영 (Optimistic Update)
      queryClient.setQueryData(['tower', userId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          stabilityScore: Math.min(100, (oldData.stabilityScore || 0) + 10),
          totalFloors: (oldData.totalFloors || 0) + 1,
          blocks: [
            ...(oldData.blocks || []),
            {
              floor_index: oldData.totalFloors || 0,
              position_index: Math.floor(Math.random() * 3),
              block_type: 'gift',
              message,
            }
          ]
        };
      });
    } catch (error) {
      console.error('응원 메시지 전송 실패:', error);
      // 에러 발생 시 사용자에게 피드백 (필요에 따라 다르게 처리 가능)
      // alert('응원 메시지를 보내는 데 실패했습니다.');
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#F0ECE4] overflow-hidden">
      {/* 상단 고정 헤더: absolute를 사용하여 모바일 레이아웃(Parent relative) 내부 상단에 고정 */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <PageHeader title="마음 둘러보기" gradientColor="purple" />
      </div>

      {/* 스크롤 영역: Snap-scroll을 위한 별도 컨테이너 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory relative pb-[60px] no-scrollbar"
      >
        {users.map((user, index) => {
          const isActive = index === activeIndex;
          const isRendered = Math.abs(index - activeIndex) <= 1;

          return (
            <SocialFeedItem
              key={`${user.id}-${index}`} // 중복 유저 대비 index 조합
              user={user}
              isActive={isActive}
              isRendered={isRendered}
              onComfort={handleComfort}
            />
          );
        })}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="w-full h-40 flex flex-col items-center justify-center p-10 pb-32">
            <div className="w-8 h-8 border-3 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium italic">새로운 마음을 찾는 중...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPage;