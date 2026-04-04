import { useState, useRef, useCallback, useEffect } from 'react';
import SocialFeedItem from '../components/features/social/SocialFeedItem';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '../components/layout/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import LoadingOverlay from '../components/ui/LoadingOverlay';

const SocialPage = () => {
  const { user: currentUser } = useAuth();
  const { users, isLoading, isError, hasMore, fetchNextUser } = useSocialFeed();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 초기 데이터 로드 (로딩 오버레이 노출)
  const isInitialLoading = users.length === 0 && isLoading;

  // 초기 데이터 로드
  useEffect(() => {
    if (users.length === 0 && !isError && hasMore) fetchNextUser();
  }, [fetchNextUser, users.length, isError, hasMore]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);

    if (index !== activeIndex && index >= 0 && index < users.length) {
      setActiveIndex(index);
      
      // 💡 마지막 아이템에 도달하면 다음 랜덤 유저를 하나 더 불러옴
      if (index === users.length - 1 && !isLoading && !isError && hasMore) {
        fetchNextUser();
      }
    }
  }, [activeIndex, users.length, isLoading, isError, hasMore, fetchNextUser]);

  const handleComfort = async (userId: number, message: string) => {
    if (!currentUser) return;

    try {
      // 1. 실제 API 호출: POST /api/cheer-messages
      await api.post('/api/cheer-messages', {
        senderId: currentUser.id,
        receiverId: userId,
        cheerType: "CHEER", // 기본 응원
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
              block_type: 'CHEER',
              message,
            }
          ]
        };
      });
    } catch (error) {
      console.error('응원 메시지 전송 실패:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#F0ECE4] overflow-hidden">
      {/* 상단 고정 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <PageHeader title="마음 둘러보기" gradientColor="purple" />
      </div>

      {/* 초기 로딩 오버레이 */}
      {isInitialLoading && <LoadingOverlay message="따뜻한 일상들을 불러오는 중입니다..." />}

      {/* 스크롤 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory relative pb-[60px] no-scrollbar"
      >
        {users.length > 0 ? (
          users.map((user, index) => {
            const isActive = index === activeIndex;
            const isRendered = Math.abs(index - activeIndex) <= 1;

            return (
              <SocialFeedItem
                key={`${user.id}-${index}`}
                user={user}
                isActive={isActive}
                isRendered={isRendered}
                onComfort={handleComfort}
              />
            );
          })
        ) : (
          !isLoading && !hasMore && !isError && (
            <div className="w-full h-full flex flex-col items-center justify-center p-10 animate-in fade-in duration-700">
              <div className="text-5xl mb-6 opacity-80">🏜️</div>
              <p className="text-slate-500 text-[16px] font-bold text-center leading-relaxed">
                현재 조회 가능한 마음 타워가 없습니다.<br />
                <span className="text-slate-400 font-medium text-sm mt-2 block">나중에 다시 방문해 주세요!</span>
              </p>
            </div>
          )
        )}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="w-full h-40 flex flex-col items-center justify-center p-10 pb-32">
            <div className="w-8 h-8 border-3 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium italic">새로운 마음을 찾는 중...</p>
          </div>
        )}

        {/* 에러 표시 */}
        {isError && (
          <div className="w-full h-60 flex flex-col items-center justify-center p-10 pb-32">
            <p className="text-slate-500 text-sm font-bold mb-4 text-center">
              데이터를 불러오는 중에 문제 발생
            </p>
            <button
              onClick={() => fetchNextUser()}
              className="bg-white border border-slate-200 px-6 py-2.5 rounded-full text-slate-700 text-sm font-extrabold"
            >
              다시 시도 🔄
            </button>
          </div>
        )}

        {/* 모든 데이터를 탐색했을 때 (FAIL) */}
        {!hasMore && users.length > 0 && !isLoading && !isError && (
          <div className="w-full h-40 flex flex-col items-center justify-center p-10 pb-32 opacity-60">
            <p className="text-slate-400 text-[13px] font-bold italic">
              ✨ 모든 마음을 다 살펴보았습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPage;