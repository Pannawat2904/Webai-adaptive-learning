'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TeacherContextType {
  isResearchMode: boolean;
  toggleResearchMode: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: React.ReactNode }) {
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preferences from local storage if exists
    try {
      const savedResearch = localStorage.getItem('webai_research_mode');
      if (savedResearch) setIsResearchMode(savedResearch === 'true');
      
      const savedDark = localStorage.getItem('webai_dark_mode');
      if (savedDark === 'true') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('webai_dark_mode', String(next));
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {}
      return next;
    });
  };

  if (!mounted) return null;

  return (
    <TeacherContext.Provider value={{ isResearchMode, toggleResearchMode, isDarkMode, toggleDarkMode }}>
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
