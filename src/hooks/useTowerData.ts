import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '../api/axios';

// ─── 타입 선언 ───────────────────────────────────────────────

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ServerBlockData {
  floor_index: number;
  position_index: number;
  block_type: string;
  message: string;
}

export interface ServerTowerData {
  id: number;
  userId: number;
  weekStartDate: string;
  totalFloors: number;
  stabilityScore: number;
  collapsed: boolean;
  blocks: ServerBlockData[];
  createdAt: string;
  updatedAt: string;
}

export interface TransformedBlockData extends ServerBlockData {
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface TransformedTowerData {
  stability_score: number;
  collapsed: boolean;
  total_floors: number;
}

export interface UseTowerDataReturn {
  tower: TransformedTowerData | null;
  blocks: TransformedBlockData[];
  isLoading: boolean;
  isError: boolean;
}

// ─── 물리 상수 및 헬퍼 함수 ──────────────────────────────────────
const BLOCK_SPACING = 1.05;
const FLOOR_HEIGHT = 1.05;

const calcBlockTransform = (floorIndex: number, positionIndex: number): {
  position: [number, number, number];
  rotation: [number, number, number];
} => {
  const isEven = floorIndex % 2 === 0;
  const y = floorIndex * FLOOR_HEIGHT + 0.5;
  const offset = (positionIndex - 1) * BLOCK_SPACING;

  return isEven 
    ? { position: [0, y, offset], rotation: [0, 0, 0] }
    : { position: [offset, y, 0], rotation: [0, Math.PI / 2, 0] };
};

// ─── 커스텀 훅 ───────────────────────────────────────────────

export const useTowerData = (userId: number | undefined): UseTowerDataReturn => {
  
  const fetchMyTower = async (): Promise<ServerTowerData | null> => {
    try {
      const response = await api.get<ApiResponse<ServerTowerData>>(
        `/api/jenga-towers/users/${userId}`
      );
      return response.data?.data ?? null;
    } catch (error: any) {
      // 💡 404 에러인 경우 타워가 없는 것이므로 null을 반환하여 온보딩 상태로 유도합니다.
      if (error.response?.status === 404) {
        return null;
      }
      // 그 외 (500, 네트워크 에러 등)는 React Query가 에러로 처리하도록 throw 합니다.
      throw error;
    }
  };

  const { data, isLoading, isError } = useQuery<ServerTowerData | null>({
    queryKey: ['tower', userId],
    queryFn: fetchMyTower,
    enabled: !!userId,
    // 💡 이전 에러 로그(TS7006) 해결을 위해 타입을 명확히 지정합니다.
    placeholderData: (prev: ServerTowerData | null | undefined) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const transformedTower = useMemo<TransformedTowerData | null>(() => {
    if (!data) return null;
    return {
      stability_score: data.stabilityScore,
      collapsed: data.collapsed,
      total_floors: data.totalFloors,
    };
  }, [data]);

  const transformedBlocks = useMemo<TransformedBlockData[]>(() => {
    if (!data || !data.blocks) return [];
    
    // 💡 에러 로그(TS7006) 해결을 위해 매개변수 타입을 지정합니다.
    return data.blocks.map((block: ServerBlockData) => {
      const { position, rotation } = calcBlockTransform(
        block.floor_index, 
        block.position_index
      );
      return { ...block, position, rotation };
    });
  }, [data?.blocks]);

  return {
    tower: transformedTower,
    blocks: transformedBlocks,
    isLoading,
    isError,
  };
};

export default useTowerData;