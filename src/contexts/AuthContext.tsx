import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextProps {
  user: User | null;
  profile: any | null;
  login: (userData: User, profileData?: any) => void;
  logout: () => void;
  updateProfile: (profileData: any) => void;
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
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
  };
  const updateProfile = (profileData: any) => {
    if (profileData !== undefined) {
      setProfile(profileData);
      localStorage.setItem('profile', JSON.stringify(profileData));
    }
  };
  // Only render children after local storage is checked to prevent flash of logged-out content
  if (!isLoaded) return null;

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, updateProfile }}>
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

