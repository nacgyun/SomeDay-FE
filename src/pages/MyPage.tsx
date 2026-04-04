import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import type { MenuItemType } from '../types';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/my/ProfileCard';
import WeekStress from '../components/features/my/WeekStress';
import MyStats from '../components/features/my/MyStats';
import MenuItem from '../components/features/my/MenuItem';
import Button from '../components/ui/Button';
import api from '../api/axios';

// ─── 메뉴 항목 ──────────────────────────────────────────────
const MENU_ITEMS: MenuItemType[] = [
  { id: 'history', icon: '📊', label: '나의 기록' },
  { id: 'inquiry', icon: '💬', label: '문의하기' },
  { id: 'terms', icon: '📄', label: '이용약관' },
];

const getMyProfile = async (userId: number) => {
  const response = await api.get(`/api/my-profiles/${userId}`);
  return response.data;
};

const MyPage = () => {
  const navigate = useNavigate();
  const { user, profile, logout, updateProfile } = useAuth();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 주간 안정도 수치 API 연동
  const { data: weeklyData = [] } = useQuery({
    queryKey: ['weeklyStability', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get(`/api/mental-analyses/${user.id}/weekly-stability`);

      if (response.data && response.data.scores) {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return response.data.scores.map((item: any) => ({
          day: days[new Date(item.date).getDay()],
          level: item.stabilityScore || 0
        }));
      }
      return [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (user?.id && !profile) {
      getMyProfile(user.id)
        .then(data => {
          if (data) {
            updateProfile(data);
          }
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
        });
    }
  }, [user?.id, profile, updateProfile]);

  return (
    <div className="min-h-screen bg-[#F0ECE4] pb-20 text-slate-800 relative font-sans">
      <PageHeader title="마이페이지" gradientColor="orange" />

      {/* 프로필 카드 */}
      <section className="px-5 mb-4">
        <ProfileCard
          name={user?.nickname || user?.name || '사용자님'}
          email={user?.email || 'user@someday.app'}
          avatar={profile?.avatarEmoji || '😊'}
          onEdit={() => setIsAccountModalOpen(true)}
        />
      </section>

      {/* 주간 안정도 변화 카드 */}
      <section className="px-5 mb-4">
        <WeekStress data={weeklyData} />
      </section>

      {/* 4가지 요약 통계 */}
      <section className="px-5 mb-4">
        <MyStats
          consecutiveDays={profile?.consecutiveDays || 0}
          towerFloors={profile?.totalLayers || 0}
          receivedCheers={profile?.cheersReceived || 0}
          sentConsoles={profile?.cheersSent || 0}
        />
      </section>

      {/* 메뉴 리스트 */}
      <section className="px-5">
        <div className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-5">
          <div className="bg-[#F7F3EB] border border-slate-100 rounded-3xl w-full max-w-[360px] p-6 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">계정 설정</h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                fullWidth
                className="!justify-start !px-5 !bg-white !text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
              >
                <span className="mr-2">🖼️</span> 사용자 이모티콘 바꾸기
              </Button>

              <Button
                variant="ghost"
                fullWidth
                className="!justify-start !px-5 !bg-white !text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
              >
                <span className="mr-2">✏️</span> 닉네임 변경하기
              </Button>

              <Button
                variant="ghost"
                fullWidth
                className="!justify-start !px-5 !bg-white !text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
              >
                <span className="mr-2">📧</span> 이메일 변경하기
              </Button>

              <div className="h-px bg-slate-200 my-1 " />

              <Button
                variant="ghost"
                fullWidth
                className="!justify-start !px-5 !bg-white !text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
              >
                <span className="mr-2">⚙️</span> 시스템 설정
              </Button>

              <Button
                variant="danger"
                fullWidth
                className="!justify-start !px-5"
                onClick={handleLogout}
              >
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
