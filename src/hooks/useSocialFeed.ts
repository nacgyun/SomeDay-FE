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
  const queryClient = useQueryClient();

  const fetchNextUser = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 💡 GET /api/jenga-towers/users/random 요청
      // 본인의 타워는 나오지 않도록 excludeUserId 파라미터 추가
      const response = await api.get('/api/jenga-towers/users/random', {
        params: { excludeUserId: user?.id }
      });
      const towerData = response.data?.data;

      if (towerData) {
        // 1. 타워 데이터를 React Query 캐시에 미리 저장 (useTowerData에서 즉시 사용 가능)
        // 서버 응답의 stabilityScore 등을 useTowerData가 기대하는 포맷으로 캐싱
        queryClient.setQueryData(['tower', towerData.userId], towerData);

        // 2. 피드 목록에 표시할 유저 정보 생성
        const newUser: SocialUser = {
          id: towerData.userId,
          nickname: `익명 유저 ${towerData.userId}`,
          avatarEmoji: '👤',
          comment: towerData.blocks?.[towerData.blocks.length - 1]?.message || '마음을 쌓고 있어요.',
        };

        // 3. 기존 리스트에 추가 (중복 유저는 무시하거나 허용 가능)
        setUsers((prev) => [...prev, newUser]);
      }
    } catch (error) {
      console.error('랜덤 타워 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, queryClient, user?.id]);

  return { users, isLoading, fetchNextUser };
};