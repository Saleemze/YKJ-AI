// FIX: Add DOM library reference to resolve 'localStorage' and other DOM API type errors.
/// <reference lib="dom" />

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a saved user session in localStorage on initial load
    try {
      const savedUser = localStorage.getItem('ykj-ai-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('ykj-ai-user');
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, you'd fetch from an API. Here we simulate with localStorage.
    const storedUsers = JSON.parse(localStorage.getItem('ykj-ai-users') || '{}');
    const registeredUser = storedUsers[email.toLowerCase()];

    if (registeredUser && registeredUser.password === password) {
      const loggedInUser = { name: registeredUser.name, email: registeredUser.email };
      setUser(loggedInUser);
      localStorage.setItem('ykj-ai-user', JSON.stringify(loggedInUser));
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const storedUsers = JSON.parse(localStorage.getItem('ykj-ai-users') || '{}');
    const lowerCaseEmail = email.toLowerCase();
    
    if (storedUsers[lowerCaseEmail]) {
      throw new Error('An account with this email already exists.');
    }
    
    storedUsers[lowerCaseEmail] = { name, email: lowerCaseEmail, password };
    localStorage.setItem('ykj-ai-users', JSON.stringify(storedUsers));

    const newUser = { name, email: lowerCaseEmail };
    setUser(newUser);
    localStorage.setItem('ykj-ai-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ykj-ai-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
