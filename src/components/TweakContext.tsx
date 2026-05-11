'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Tweaks {
  accent: string;
  primary: string;
  heroImg: string;
  headlineFont: string;
}

const TWEAK_DEFAULTS: Tweaks = {
  accent: "#c45a3a",
  primary: "#1f3b30",
  heroImg: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=2000&auto=format&fit=crop",
  headlineFont: "Newsreader",
};

interface TweakContextType {
  tweaks: Tweaks;
  setTweak: (key: keyof Tweaks, value: string) => void;
}

const TweakContext = createContext<TweakContextType | undefined>(undefined);

export const TweakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);

  const setTweak = (key: keyof Tweaks, value: string) => {
    setTweaks(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--clay', tweaks.accent);
    document.documentElement.style.setProperty('--clay-2', shade(tweaks.accent, 0.12));
    document.documentElement.style.setProperty('--forest', tweaks.primary);
    document.documentElement.style.setProperty('--forest-2', shade(tweaks.primary, 0.15));
    document.documentElement.style.setProperty('--serif', `'${tweaks.headlineFont}', Georgia, serif`);
  }, [tweaks]);

  return (
    <TweakContext.Provider value={{ tweaks, setTweak }}>
      {children}
    </TweakContext.Provider>
  );
};

export const useTweaks = () => {
  const context = useContext(TweakContext);
  if (!context) throw new Error('useTweaks must be used within TweakProvider');
  return context;
};

function shade(hex: string, amt: number) {
  const c = hex.replace('#','');
  let r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16);
  r = Math.min(255, Math.round(r + (255 - r) * amt));
  g = Math.min(255, Math.round(g + (255 - g) * amt));
  b = Math.min(255, Math.round(b + (255 - b) * amt));
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
}
