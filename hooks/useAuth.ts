'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Try to refresh token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
        });

        if (refreshResponse.ok) {
          const { accessToken } = await refreshResponse.json();
          sessionStorage.setItem('accessToken', accessToken);
          fetchUserProfile();
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('accessToken');
      setUser(null);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        sessionStorage.setItem('accessToken', accessToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    register,
    refreshToken,
    isAuthenticated: !!user,
  };
}