import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (check localStorage or make API call)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call to your Flask backend
      // const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Mock user for demo
      const mockUser: User = {
        user_id: 1,
        username: 'demo_user',
        email: email,
        display_name: 'Demo User',
        bio: 'This is a demo account',
        is_verified: true,
        created_at: new Date().toISOString(),
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string, displayName: string) => {
    try {
      // TODO: Replace with actual API call to your Flask backend
      // const response = await axios.post('http://localhost:5000/api/auth/signup', {
      //   username, email, password, display_name: displayName
      // });
      
      const mockUser: User = {
        user_id: Date.now(),
        username,
        email,
        display_name: displayName,
        is_verified: false,
        created_at: new Date().toISOString(),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
