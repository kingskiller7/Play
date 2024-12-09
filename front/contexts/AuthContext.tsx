'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile(token)
        .then(userData => {
          setUser(userData);
          return api.isAdmin(token);
        })
        .then(adminStatus => {
          setIsAdmin(adminStatus);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
    setIsAdmin(await api.isAdmin(response.token));
    router.push(response.user.role === 'admin' ? '/admin' : '/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.register({ name, email, password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
    setIsAdmin(false); // New users are not admins by default
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    router.push('/login');
  };

  const updateUser = async (data: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      const updatedUser = await api.updateProfile(token, data);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, register, updateUser, loading }}>
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

