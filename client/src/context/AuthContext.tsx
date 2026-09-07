import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  user?: User;
  _id?: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => Promise<void>;
  register: (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  updateAccount: (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => Promise<AuthResponse>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/user/check');
      setUser(res.data.user || res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkUser();
  }, []);

  const login = async (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    const res = await api.post('/auth/user/login', data);
    setUser(res.data.user || res.data);
  };

  const register = async (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    const res = await api.post('/auth/user/register', data);
    return res.data;
  };

  const resendVerification = async (email: string) => {
    const res = await api.post('/auth/user/resend', { email });
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/user/logout');
    setUser(null);
  };

  const updateAccount = async (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    const res = await api.put('/auth/user/update', data);
    return res.data as AuthResponse;
  };

  const deleteAccount = async () => {
    await api.delete('/auth/user/delete');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, resendVerification, updateAccount, deleteAccount, logout, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
