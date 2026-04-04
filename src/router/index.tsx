import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import SocialPage from '../pages/SocialPage';
import MissionPage from '../pages/MissionPage';
import MyPage from '../pages/MyPage';
import MainLayout from '../layouts/MainLayout';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/login" element={<LoginPage />} />

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
