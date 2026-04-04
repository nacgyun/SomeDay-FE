import { Outlet } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

const MainLayout = () => {
  return (
    <div className="w-full max-w-[480px] mx-auto min-h-screen relative bg-[#F0ECE4] shadow-2xl shadow-black/20 text-slate-800">
      <main className="w-full min-h-screen overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
