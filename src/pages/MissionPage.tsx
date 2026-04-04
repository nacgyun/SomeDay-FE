import { useState } from 'react';
import type { Mission } from '../types';
import PageHeader from '../components/layout/PageHeader';
import MentalFlow from '../components/features/mission/MentalFlow';
import MissionTabs from '../components/features/mission/MissionTabs';
import MissionItem from '../components/features/mission/MissionItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const INIT_MISSIONS: Mission[] = [
  { id: 1, icon: '🏃', title: '아침 러닝 30분', category: '운동', done: true, point: 50 },
  { id: 2, icon: '📚', title: '독서 20페이지', category: '자기계발', done: true, point: 30 },
  { id: 3, icon: '💧', title: '물 2L 마시기', category: '건강', done: false, point: 20 },
  { id: 4, icon: '🧘', title: '명상 10분', category: '마음챙김', done: false, point: 25 },
  { id: 5, icon: '✍️', title: '일기 쓰기', category: '루틴', done: false, point: 15 },
];

const WEEKLY_MENTAL_DATA = [
  { day: '월', level: 30 },
  { day: '화', level: 85 },
  { day: '수', level: 45 },
  { day: '목', level: 20 },
  { day: '금', level: 60 },
  { day: '토', level: 15 },
  { day: '일', level: 25 },
];
// ──────────────────────────────────────────────────────────────

const MissionPage = () => {
  const [missions, setMissions] = useState<Mission[]>(INIT_MISSIONS);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);

  const handleToggle = (id: number) => {
    const targetMission = missions.find((m) => m.id === id);
    if (!targetMission) return;

    if (!targetMission.done) {
      // 완료 처리하려고 할 때 팝업 표시
      setPendingMission(targetMission);
    } else {
      // 체크 해제는 바로 적용
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

  const filtered =
    activeCategory === '전체'
      ? missions
      : missions.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface pb-20 text-white relative">
      <PageHeader
        title="미션 & 회복 가이드"
        gradientColor="green"
      />

      {/* 이번 주 멘탈 흐름 */}
      <section className="px-5 mb-5">
        <MentalFlow data={WEEKLY_MENTAL_DATA} />
      </section>

      {/* 카테고리 탭 */}
      <section className="px-5 mb-5">
        <MissionTabs activeCategory={activeCategory} onChange={setActiveCategory} />
      </section>

      {/* 미션 리스트 */}
      <section className="px-5">
        <div className="flex flex-col gap-2.5">
          {filtered.map((mission) => (
            <MissionItem key={mission.id} mission={mission} onToggle={handleToggle} />
          ))}
        </div>
      </section>

      {/* 미션 완료 확인 팝업 */}
      {pendingMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
          <div className="bg-surface-secondary border border-white/10 rounded-2xl w-full max-w-[320px] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 text-center">미션 완료</h3>
            <p className="text-[15px] text-white/70 mb-6 text-center leading-relaxed">
              <span className="text-brand-green font-bold">'{pendingMission.title}'</span>을(를)<br />완료 하셨나요?
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
