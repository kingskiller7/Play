'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile(token)
        .then(userData => {
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
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
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAdmin(response.user.role === 'admin');
      router.push(response.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({ name, email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAdmin(false); // New users are not admins by default
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    router.push('/login');
  };

  const updateUser = async (data: Partial<User>) => {
    const token = localStorage.getItem('token');
    if (token && user) {
      try {
        const updatedUser = await api.updateProfile(token, data);
        setUser(updatedUser);
        setIsAdmin(updatedUser.role === 'admin');
      } catch (error) {
        console.error('Update user error:', error);
        throw error;
      }
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

