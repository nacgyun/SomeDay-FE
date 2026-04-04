import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export interface SocialUser {
  id: number;
  nickname: string;
  avatarEmoji: string;
  comment: string;
}

export const useSocialFeed = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<SocialUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const fetchNextUser = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setIsError(false);

    try {
      // 💡 GET /api/jenga-towers/users/random 요청
      const response = await api.get('/api/jenga-towers/users/random', {
        params: { excludeUserId: user?.id }
      });

      // API 응답 상태 확인
      if (response.data?.status === 'FAIL') {
        setHasMore(false);
        console.warn('더 이상 조회 가능한 타워가 없습니다. (FAIL)');
        return;
      }

      const towerData = response.data?.data;

      if (towerData) {
        // 1. 타워 데이터를 React Query 캐시에 미리 저장
        queryClient.setQueryData(['tower', towerData.userId], towerData);

        // 2. 피드 목록에 표시할 유저 정보 생성
        const newUser: SocialUser = {
          id: towerData.userId,
          nickname: `익명 유저 ${towerData.userId}`,
          avatarEmoji: '👤',
          comment: towerData.blocks?.[towerData.blocks.length - 1]?.message || '마음을 쌓고 있어요.',
        };

        // 3. 기존 리스트에 추가
        setUsers((prev) => [...prev, newUser]);
      } else {
        setHasMore(false);
        console.warn('더 이상 불러올 타워가 없습니다.');
      }
    } catch (error) {
      console.error('랜덤 타워 로드 실패:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, queryClient, user?.id]);

  return { users, isLoading, isError, hasMore, fetchNextUser };
};