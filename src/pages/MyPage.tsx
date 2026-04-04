import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuItemType } from '../types';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/my/ProfileCard';
import WeekStress from '../components/features/my/WeekStress';
import MyStats from '../components/features/my/MyStats';
import MenuItem from '../components/features/my/MenuItem';
import Button from '../components/ui/Button';

// ─── 더미 데이터 ──────────────────────────────────────────────
const MENU_ITEMS: MenuItemType[] = [
  { id: 'history', icon: '📊', label: '나의 기록' },
  { id: 'inquiry', icon: '💬', label: '문의하기' },
  { id: 'terms', icon: '📄', label: '이용약관' },
];

const WEEKLY_STRESS_DATA = [
  { day: '월', level: 65 },
  { day: '화', level: 82 },
  { day: '수', level: 45 },
  { day: '목', level: 30 },
  { day: '금', level: 90 },
  { day: '토', level: 25 },
  { day: '일', level: 55 },
];
// ──────────────────────────────────────────────────────────────

const MyPage = () => {
  const navigate = useNavigate();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface pb-20 text-white relative">
      <PageHeader title="마이페이지" gradientColor="orange" />

      {/* 프로필 카드 */}
      <section className="px-5 mb-4">
        <ProfileCard
          name="사용자님"
          email="user@someday.app"
          avatar="😊"
          onEdit={() => setIsAccountModalOpen(true)}
        />
      </section>

      {/* 주간 스트레스 변화 카드 */}
      <section className="px-5 mb-4">
        <WeekStress data={WEEKLY_STRESS_DATA} />
      </section>

      {/* 4가지 요약 통계 */}
      <section className="px-5 mb-4">
        <MyStats
          consecutiveDays={12}
          towerFloors={34}
          receivedCheers={5}
          sentConsoles={8}
        />
      </section>

      {/* 메뉴 리스트 */}
      <section className="px-5">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] overflow-hidden">
          {MENU_ITEMS.map((item, i) => (
            <MenuItem
              key={item.id}
              item={item}
              isLast={i === MENU_ITEMS.length - 1}
              onClick={() => {
                if (item.id === 'history') {
                  navigate('/my/records');
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* 계정 설정 모달 */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5">
          <div className="bg-surface-secondary border border-white/10 rounded-3xl w-full max-w-[360px] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">계정 설정</h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="ghost" fullWidth className="!justify-start !px-5">
                <span className="mr-2">🖼️</span> 사용자 프로필 사진 바꾸기
              </Button>
              <Button variant="ghost" fullWidth className="!justify-start !px-5">
                <span className="mr-2">✏️</span> 닉네임 변경하기
              </Button>
              <Button variant="ghost" fullWidth className="!justify-start !px-5">
                <span className="mr-2">📧</span> 이메일 변경하기
              </Button>
              <div className="h-px bg-white/10 my-1" />
              <Button variant="ghost" fullWidth className="!justify-start !px-5">
                <span className="mr-2">⚙️</span> 시스템 설정
              </Button>
              <Button variant="danger" fullWidth className="!justify-start !px-5" onClick={handleLogout}>
                <span className="mr-2">🚪</span> 로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
