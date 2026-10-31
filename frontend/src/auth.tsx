import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type User = { id: number; name: string; role: string; token: string };

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const res = await axios.post('http://localhost:3000/auth/login', { username, password });
    const token = res.data.token;
    // minimal user info
    setUser({ id: res.data.user.id, name: res.data.user.name, role: res.data.user.role, token });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) throw new Error('Invalid token');
        const payload = JSON.parse(atob(payloadPart));
        setUser({ id: payload.id, name: payload.username || 'Admin', role: payload.role, token });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
};
