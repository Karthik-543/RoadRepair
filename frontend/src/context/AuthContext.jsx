import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('roadsense_token');
      const storedUser = localStorage.getItem('roadsense_user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await getCurrentUser();
          setUser(res.user);
        } catch (error) {
          logoutUser();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';
  const isCitizen = user && user.role === 'citizen';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isCitizen,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
