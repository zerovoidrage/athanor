'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'founder' | 'investor' | 'advisor' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  displayName: string;
  isLoading: boolean;
  login: (role: UserRole) => void;
  setDisplayName: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const savedAuth = localStorage.getItem('athanor_auth');
    console.log('Loading auth from localStorage:', savedAuth);
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        console.log('Parsed auth data:', authData);
        setIsAuthenticated(authData.isAuthenticated || false);
        setUserRole(authData.userRole || null);
        setDisplayName(authData.displayName || '');
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('athanor_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    
    // Сохраняем в localStorage
    const authData = {
      isAuthenticated: true,
      userRole: role,
      displayName: displayName
    };
    localStorage.setItem('athanor_auth', JSON.stringify(authData));
  };

  const updateDisplayName = (name: string) => {
    setDisplayName(name);
    
    // Обновляем localStorage
    const authData = {
      isAuthenticated,
      userRole,
      displayName: name
    };
    localStorage.setItem('athanor_auth', JSON.stringify(authData));
  };

  // Обновляем localStorage при изменении состояния аутентификации
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const authData = {
        isAuthenticated,
        userRole,
        displayName
      };
      localStorage.setItem('athanor_auth', JSON.stringify(authData));
    }
  }, [isAuthenticated, userRole, displayName]);

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setDisplayName('');
    
    // Удаляем из localStorage
    localStorage.removeItem('athanor_auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      displayName,
      isLoading,
      login, 
      setDisplayName: updateDisplayName,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
