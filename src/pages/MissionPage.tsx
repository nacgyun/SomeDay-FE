import { useState } from 'react';
import type { Mission } from '../types';
import PageHeader from '../components/layout/PageHeader';
import MissionProgressCard from '../components/features/mission/MissionProgressCard';
import MissionTabs from '../components/features/mission/MissionTabs';
import MissionItem from '../components/features/mission/MissionItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const INIT_MISSIONS: Mission[] = [
  { id: 1, icon: '🏃', title: '아침 러닝 30분', category: '운동',    done: true,  point: 50 },
  { id: 2, icon: '📚', title: '독서 20페이지',  category: '자기계발', done: true,  point: 30 },
  { id: 3, icon: '💧', title: '물 2L 마시기',   category: '건강',    done: false, point: 20 },
  { id: 4, icon: '🧘', title: '명상 10분',      category: '마음챙김', done: false, point: 25 },
  { id: 5, icon: '✍️', title: '일기 쓰기',      category: '루틴',    done: false, point: 15 },
];
// ──────────────────────────────────────────────────────────────

const MissionPage = () => {
  const [missions, setMissions] = useState<Mission[]>(INIT_MISSIONS);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  const handleToggle = (id: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const filtered =
    activeCategory === '전체'
      ? missions
      : missions.filter((m) => m.category === activeCategory);

  const doneMissions = missions.filter((m) => m.done);

  return (
    <div className="min-h-screen bg-surface pb-20 text-white">
      <PageHeader
        title="미션"
        gradientColor="green"
        action={
          <Button id="mission-add-btn" variant="green" className="text-[13px] !py-2 !px-4 !rounded-full">
            + 추가
          </Button>
        }
      />

      {/* 진행률 */}
      <section className="px-5 mb-5">
        <MissionProgressCard done={doneMissions.length} total={missions.length} />
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
    </div>
  );
};

export default MissionPage;
