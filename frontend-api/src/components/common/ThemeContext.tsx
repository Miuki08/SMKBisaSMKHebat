"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  primaryColor: string;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  themeBackground: string;
  setThemeBackground: (color: string) => void;
  menuBackground: string;
  setMenuBackground: (bg: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('blue');
  const [themeBackground, setThemeBackground] = useState('primary-1');
  const [menuBackground, setMenuBackground] = useState('bg-1');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Hanya jalankan di client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const savedPrimaryColor = localStorage.getItem('primaryColor');
      const savedThemeBackground = localStorage.getItem('themeBackground');
      const savedMenuBackground = localStorage.getItem('menuBackground');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
      
      if (savedPrimaryColor) {
        setPrimaryColor(savedPrimaryColor);
        updateCssVariable(savedPrimaryColor);
      }
      
      if (savedThemeBackground) {
        setThemeBackground(savedThemeBackground);
      }
      
      if (savedMenuBackground) {
        setMenuBackground(savedMenuBackground);
      }
    }
  }, []);

  const updateCssVariable = (color: string) => {
    const colorValues: Record<string, string> = {
      blue: '59 130 246',
      purple: '139 92 246',
      green: '34 197 94',
      yellow: '234 179 8',
      red: '239 68 68'
    };
    
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', colorValues[color] || '59 130 246');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const updatePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    updateCssVariable(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('primaryColor', color);
    }
  };

  const updateThemeBackground = (color: string) => {
    setThemeBackground(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeBackground', color);
    }
  };

  const updateMenuBackground = (bg: string) => {
    setMenuBackground(bg);
    if (typeof window !== 'undefined') {
      localStorage.setItem('menuBackground', bg);
    }
  };

  // Render placeholder selama belum mounted untuk menghindari hydration mismatch
  if (!isMounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      primaryColor, 
      toggleTheme, 
      setPrimaryColor: updatePrimaryColor,
      themeBackground,
      setThemeBackground: updateThemeBackground,
      menuBackground,
      setMenuBackground: updateMenuBackground
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

console.log("ThemeContext instance:", ThemeContext);
