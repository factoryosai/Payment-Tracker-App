import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  profile: UserProfile | null;
  loading: boolean;
  loginAs: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  loginAs: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('local_auth_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse local profile', e);
      }
    }
    setLoading(false);
  }, []);

  const loginAs = async (role: UserRole) => {
    try {
      const newProfile: UserProfile = {
        id: `local_${role}_${Date.now()}`,
        name: role === 'admin' ? 'Admin User' : 'Standard User',
        email: '',
        role: role,
        status: 'active',
        created_at: Date.now(),
      };
      
      localStorage.setItem('local_auth_profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('local_auth_profile');
      setProfile(null);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ profile, loading, loginAs, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
