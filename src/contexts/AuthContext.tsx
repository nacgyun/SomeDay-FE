import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import api from '../api/axios';

interface AuthContextProps {
  user: User | null;
  profile: any | null;
  login: (userData: User, profileData?: any) => void;
  logout: () => void;
  updateProfile: (profileData: any) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('profile');

    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }

    if (storedProfile && storedProfile !== 'undefined') {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Failed to parse profile from localStorage', e);
      }
    }

    setIsLoaded(true);
  }, []);

  const login = (userData: User, profileData?: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    if (profileData) {
      setProfile(profileData);
      localStorage.setItem('profile', JSON.stringify(profileData));
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    
    // 로컬 스토리지의 모든 인증 및 세션 정보 삭제
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('hideStabilityWarningDay');
    
    // 필요 시 전체 초기화: localStorage.clear();
  };
  const updateProfile = (profileData: any) => {
    if (profileData !== undefined) {
      setProfile(profileData);
      localStorage.setItem('profile', JSON.stringify(profileData));
    }
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/api/my-profiles/${user.id}`);
      if (response.data) {
        setProfile(response.data);
        localStorage.setItem('profile', JSON.stringify(response.data));
        console.log('Profile refreshed:', response.data);
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  // Only render children after local storage is checked to prevent flash of logged-out content
  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

