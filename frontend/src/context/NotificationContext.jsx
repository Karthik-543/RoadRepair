import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, isCitizen } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.warn('Failed to load notifications');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications: loadNotifications,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
