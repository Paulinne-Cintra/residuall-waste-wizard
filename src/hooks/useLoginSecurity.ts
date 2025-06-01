
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

interface LoginSecurityState {
  isBlocked: boolean;
  remainingTime: number;
  attemptCount: number;
}

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 30 * 60 * 1000; // 30 minutes

export const useLoginSecurity = () => {
  const [securityState, setSecurityState] = useState<LoginSecurityState>({
    isBlocked: false,
    remainingTime: 0,
    attemptCount: 0,
  });

  const getStorageKey = (identifier: string) => `login_attempts_${identifier}`;

  const getAttempts = (identifier: string): LoginAttempt[] => {
    try {
      const stored = localStorage.getItem(getStorageKey(identifier));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const setAttempts = (identifier: string, attempts: LoginAttempt[]) => {
    localStorage.setItem(getStorageKey(identifier), JSON.stringify(attempts));
  };

  const cleanOldAttempts = (attempts: LoginAttempt[]): LoginAttempt[] => {
    const cutoff = Date.now() - ATTEMPT_WINDOW;
    return attempts.filter(attempt => attempt.timestamp > cutoff);
  };

  const checkSecurityState = (identifier: string) => {
    const attempts = cleanOldAttempts(getAttempts(identifier));
    const failedAttempts = attempts.filter(a => !a.success);
    
    if (failedAttempts.length >= MAX_ATTEMPTS) {
      const lastFailedAttempt = Math.max(...failedAttempts.map(a => a.timestamp));
      const blockEndTime = lastFailedAttempt + BLOCK_DURATION;
      const remainingTime = Math.max(0, blockEndTime - Date.now());
      
      setSecurityState({
        isBlocked: remainingTime > 0,
        remainingTime: Math.ceil(remainingTime / 1000),
        attemptCount: failedAttempts.length,
      });

      return remainingTime > 0;
    }

    setSecurityState({
      isBlocked: false,
      remainingTime: 0,
      attemptCount: failedAttempts.length,
    });

    return false;
  };

  const recordAttempt = async (identifier: string, success: boolean, additionalData?: any) => {
    const attempts = cleanOldAttempts(getAttempts(identifier));
    const newAttempt: LoginAttempt = {
      timestamp: Date.now(),
      success,
    };
    
    attempts.push(newAttempt);
    setAttempts(identifier, attempts);

    // Also record in database if authenticated
    try {
      await supabase
        .from('login_history')
        .insert({
          success,
          device_info: navigator.userAgent,
          location: 'Brasil', // Could be enhanced with geolocation
          ip_address: null, // Would need server-side implementation
          ...additionalData
        });
    } catch (error) {
      console.warn('Could not record login attempt in database:', error);
    }

    return checkSecurityState(identifier);
  };

  const clearAttempts = (identifier: string) => {
    localStorage.removeItem(getStorageKey(identifier));
    setSecurityState({
      isBlocked: false,
      remainingTime: 0,
      attemptCount: 0,
    });
  };

  const formatRemainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Update remaining time every second
  useEffect(() => {
    if (securityState.isBlocked && securityState.remainingTime > 0) {
      const interval = setInterval(() => {
        setSecurityState(prev => ({
          ...prev,
          remainingTime: Math.max(0, prev.remainingTime - 1),
          isBlocked: prev.remainingTime > 1,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [securityState.isBlocked, securityState.remainingTime]);

  return {
    securityState,
    checkSecurityState,
    recordAttempt,
    clearAttempts,
    formatRemainingTime,
  };
};
