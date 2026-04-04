import { useState } from 'react';
import type { Mission } from '../types';
import PageHeader from '../components/layout/PageHeader';
import MissionOXList from '../components/features/mission/MissionOXList';
import MissionItem from '../components/features/mission/MissionItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 생성 함수 ──────────────────────────────────────────
const generateMockMissions = (): Mission[] => {
  const missionPool = [
    { title: '아침 러닝 30분', icon: '🏃', category: '운동' },
    { title: '독서 20페이지', icon: '📚', category: '자기계발' },
    { title: '물 2L 마시기', icon: '💧', category: '건강' },
    { title: '명상 10분', icon: '🧘', category: '마음챙김' },
    { title: '일기 쓰기', icon: '✍️', category: '루틴' },
    { title: '스트레칭 하기', icon: '🙆', category: '운동' },
    { title: '비타민 챙겨먹기', icon: '💊', category: '건강' },
    { title: '외국어 공부 15분', icon: '🌍', category: '자기계발' },
  ];

  const missions: Mission[] = [];
  let idCounter = 1;

  for (let day = 0; day < 7; day++) {
    for (let m = 0; m < 3; m++) {
      const poolItem = missionPool[(day * 3 + m) % missionPool.length];
      missions.push({
        id: idCounter++,
        icon: poolItem.icon,
        title: poolItem.title,
        category: poolItem.category,
        done: day < 5 ? (day % 2 === 0 ? true : m === 0) : false, // 과거 데이터 중 일부는 성공, 최근(5,6)은 실패/진행중 목업
        point: 10,
        dayOffset: day,
      });
    }
  }
  return missions;
};

const INIT_MISSIONS = generateMockMissions();
// ──────────────────────────────────────────────────────────────

const MissionPage = () => {
  const [missions, setMissions] = useState<Mission[]>(INIT_MISSIONS);
  const [selectedDayOffset, setSelectedDayOffset] = useState(6); // 기본값: 오늘(6)
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);

  // 선택된 날짜의 미션들만 필터링
  const displayedMissions = missions.filter(m => m.dayOffset === selectedDayOffset);

  const handleToggle = (id: number) => {
    const targetMission = missions.find((m) => m.id === id);
    if (!targetMission) return;

    if (!targetMission.done) {
      if (selectedDayOffset !== 6) {
        alert('오늘의 미션만 완료 처리할 수 있습니다.');
        return;
      }
      setPendingMission(targetMission);
    } else {
      // 완료 취소는 자유롭게 (테스트용)
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, done: false } : m))
      );
    }
  };

  const confirmMissionComplete = () => {
    if (!pendingMission) return;
    setMissions((prev) =>
      prev.map((m) => (m.id === pendingMission.id ? { ...m, done: true } : m))
    );
    setPendingMission(null);
  };

  return (
    <div className="min-h-screen bg-[#F0ECE4] pb-20 text-slate-800 relative">
      <PageHeader
        title="미션 & 회복 가이드"
        gradientColor="green"
      />

      {/* 7일 OX 리스트 섹션 */}
      <section className="px-5 mb-6">
        <MissionOXList 
          missions={missions} 
          selectedDayOffset={selectedDayOffset}
          onDaySelect={setSelectedDayOffset}
        />
      </section>

      {/* 미션 리스트 헤더 */}
      <div className="px-5 mb-3 flex justify-between items-end">
        <h3 className="text-lg font-bold text-slate-800">
          {selectedDayOffset === 6 ? '오늘의 미션' : '지난 미션 기록'}
        </h3>
        <span className="text-[13px] text-slate-500 font-medium">
          {displayedMissions.filter(m => m.done).length} / {displayedMissions.length} 완료
        </span>
      </div>

      {/* 미션 리스트 */}
      <section className="px-5">
        <div className="flex flex-col gap-2.5">
          {displayedMissions.length > 0 ? (
            displayedMissions.map((mission) => (
              <MissionItem 
                key={mission.id} 
                mission={mission} 
                onToggle={handleToggle} 
              />
            ))
          ) : (
            <div className="py-10 text-center text-slate-400">
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
