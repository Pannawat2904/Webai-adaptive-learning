'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TeacherContextType {
  isResearchMode: boolean;
  toggleResearchMode: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: React.ReactNode }) {
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preference from local storage if exists
    try {
      const saved = localStorage.getItem('webai_research_mode');
      if (saved) setIsResearchMode(saved === 'true');
    } catch {
      // ignore
    }
  }, []);

  const toggleResearchMode = () => {
    setIsResearchMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('webai_research_mode', String(next));
      } catch {}
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <TeacherContext.Provider value={{ isResearchMode, toggleResearchMode }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacherContext() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeacherContext must be used within a TeacherProvider');
  }
  return context;
}
