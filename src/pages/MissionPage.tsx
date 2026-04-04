import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Mission } from '../types';
import PageHeader from '../components/layout/PageHeader';
import MissionOXList from '../components/features/mission/MissionOXList';
import MissionItem from '../components/features/mission/MissionItem';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const MissionPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDayOffset, setSelectedDayOffset] = useState(6); // 기본값: 오늘(6)
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);

  // TanStack Query를 이용한 데이터 페칭
  const queryKey = ['recoveryMissions', user?.id, 'recent'];
  const { data: missions = [], isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/api/recovery-missions/${user.id}/recent`);

      if (response.data && Array.isArray(response.data)) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; // "2026-04-05" 형식 추출
        
        // 오늘 날짜를 로컬 기준으로 정확히 잡기
        const today = new Date(todayStr);
        today.setHours(0, 0, 0, 0);

        return response.data.map((item: any) => {
          let dayOffset = 6;
          
          if (item.missionDate) {
            // YYYY-MM-DD 형식을 로컬 날짜로 안전하게 변환
            const mDateParts = item.missionDate.split('-');
            const missionDate = new Date(
              parseInt(mDateParts[0]),
              parseInt(mDateParts[1]) - 1,
              parseInt(mDateParts[2])
            );
            missionDate.setHours(0, 0, 0, 0);
            
            const diffTime = today.getTime() - missionDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            dayOffset = 6 - diffDays;
          }

          return {
            ...item,
            id: item.id || Math.random(),
            dayOffset: dayOffset,
            done: item.completed 
          } as Mission;
        });
      }
      return [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5 // 5분 간 캐시 유지
  });

  // 미션 완료 API 처리 (Mutation)
  const completeMutation = useMutation({
    mutationFn: async (missionId: number) => {
      return api.put(`/api/recovery-missions/${missionId}/complete`);
    },
    // Optimistic UI: 서버 응답 전 화면 캐시 먼저 수정
    onMutate: async (missionId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMissions = queryClient.getQueryData<Mission[]>(queryKey);

      if (previousMissions) {
        queryClient.setQueryData<Mission[]>(queryKey, (old) =>
          old?.map(m => m.id === missionId ? { ...m, done: true } : m)
        );
      }
      return { previousMissions };
    },
    onError: (err, _, context) => {
      if (context?.previousMissions) {
        queryClient.setQueryData(queryKey, context.previousMissions);
      }
      console.error('Mission update failed:', err);
    }
  });

  // 선택된 날짜의 미션들만 필터링 및 생성 시간(createdAt) 기준 정렬 (최신순)
  const displayedMissions = useMemo(() => 
    missions
      .filter(m => m.dayOffset === selectedDayOffset)
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }),
    [missions, selectedDayOffset]
  );

  const handleToggle = (id: number) => {
    // 지금은 데이터 조회만 연동하므로 토글은 UI 피드백 용도로만 남겨둠 (실제 반영 안 됨)
    // 과거 미션은 아예 클릭이 안 되도록 처리했으므로 별도의 분기 처리 제거
    const targetMission = missions.find((m) => m.id === id);
    if (!targetMission) return;

    if (!targetMission.done) {
      setPendingMission(targetMission);
    } else {
      // 완료 취소 등도 다음 단계에서 API 연동 예정
      console.log('API 연동 전: 완료 취소 시퀀스');
    }
  };

  const confirmMissionComplete = () => {
    if (!pendingMission) return;
    completeMutation.mutate(pendingMission.id);
    setPendingMission(null);
  };

  return (
    <div className="min-h-screen bg-[#F0ECE4] pb-20 text-slate-800 relative font-sans">
      <PageHeader
        title="미션 & 회복 가이드"
        gradientColor="green"
      />

      {/* 7일 OX 리스트 섹션 */}
      <section className="px-5 mb-6">
        <div className={`transition-opacity duration-300 ${isLoading || isFetching ? 'opacity-50' : 'opacity-100'}`}>
          <MissionOXList
            missions={missions}
            selectedDayOffset={selectedDayOffset}
            onDaySelect={setSelectedDayOffset}
          />
        </div>
      </section>

      {/* 미션 리스트 헤더 */}
      <div className="px-5 mb-3 flex justify-between items-end">
        <h2 className="text-lg font-bold text-slate-800">
          {selectedDayOffset === 6 ? '오늘의 미션' : '지난 미션 기록'}
        </h2>
        <span className="text-[13px] text-slate-500 font-medium">
          {displayedMissions.filter(m => m.done).length} / {displayedMissions.length} 완료
        </span>
      </div>

      {/* 미션 리스트 */}
      <section className="px-5">
        <div className={`flex flex-col gap-2.5 transition-opacity duration-300 ${isLoading || isFetching ? 'opacity-50' : 'opacity-100'}`}>
          {isLoading ? (
            <div className="py-20 text-center text-slate-400 animate-pulse">
              데이터를 불러오는 중입니다...
            </div>
          ) : displayedMissions.length > 0 ? (
            displayedMissions.map((mission) => (
              <MissionItem
                key={mission.id}
                mission={mission}
                onToggle={handleToggle}
                disabled={selectedDayOffset !== 6}
              />
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 bg-white/40 rounded-3xl border border-slate-100/50">
              해당 날짜의 미션 정보가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 미션 완료 확인 팝업 */}
      {pendingMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-5">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-[320px] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">미션 완료</h3>
            <p className="text-[15px] text-slate-600 mb-6 text-center leading-relaxed font-medium">
              <span className="text-brand-green-dark font-bold">'{pendingMission.title}'</span>을(를)<br />완료 하셨나요?
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" fullWidth onClick={() => setPendingMission(null)}>
                취소
              </Button>
              <Button variant="green" fullWidth onClick={confirmMissionComplete}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPage;
