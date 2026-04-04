import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import SocialPage from '../pages/SocialPage';
import MissionPage from '../pages/MissionPage';
import MyPage from '../pages/MyPage';
import MyRecordsPage from '../pages/MyRecordsPage';
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  console.log('AppRouter Loaded, checking routes...');
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 네비 없는 독립 페이지들 */}
        <Route path="/my/records" element={<MyRecordsPage />} />

        {/* 하단 네비 있는 페이지들 */}
        <Route element={<MainLayout />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/my" element={<MyPage />} />
        </Route>

        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
