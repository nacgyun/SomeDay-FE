import { Outlet } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

const MainLayout = () => {
  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen relative">
      <main className="w-full min-h-screen overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
