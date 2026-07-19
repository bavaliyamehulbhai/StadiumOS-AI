import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    wheelchair: false,
    visualSupport: false,
    hearingSupport: false,
    seniorCitizen: false,
    language: 'English',
    highContrast: false,
    largeText: false,
    preferredGate: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Apply CSS classes when profile changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (profile.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (profile.largeText) {
      root.classList.add('large-text-mode');
    } else {
      root.classList.remove('large-text-mode');
    }

    if (profile.seniorCitizen) {
      root.classList.add('senior-mode');
    } else {
      root.classList.remove('senior-mode');
    }
    
  }, [profile.highContrast, profile.largeText, profile.seniorCitizen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/accessibility/profile');
      if (res.data.data) {
        setProfile(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch accessibility profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      // Optimistic update
      setProfile(prev => ({ ...prev, ...updates }));
      
      const res = await api.patch('/accessibility/profile', updates);
      if (res.data.data) {
        setProfile(res.data.data);
      }
      return true;
    } catch (error) {
      console.error('Failed to update accessibility profile:', error);
      // Revert optimism if needed (simplified here)
      return false;
    }
  };

  return (
    <AccessibilityContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
