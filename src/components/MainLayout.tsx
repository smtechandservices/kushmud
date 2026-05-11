'use client';

import React from 'react';
import { TweakProvider, useTweaks } from './TweakContext';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect } from './TweaksPanel';

const ACCENT_OPTIONS = ['#c45a3a', '#c79a4a', '#1f3b30', '#475569'];
const PRIMARY_OPTIONS = ['#1f3b30', '#1c1916', '#2e4d6b', '#553c2c'];
const HERO_OPTIONS = [
  { label: 'Rajasthan palace', val: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=2000&auto=format&fit=crop' },
  { label: 'Dubai skyline', val: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=2000&auto=format&fit=crop' },
  { label: 'Kerala backwaters', val: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2000&auto=format&fit=crop' },
  { label: 'Sheikh Zayed mosque', val: 'https://images.unsplash.com/photo-1583395145039-1c50b89def85?w=2000&auto=format&fit=crop' },
];

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TweakProvider>
      {children}
    </TweakProvider>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tweaks, setTweak } = useTweaks();
  
  return (
    <div className="app">
      <Nav />
      <main className="grow">{children}</main>
      <Footer />
      
      <TweaksPanel>
        <TweakSection label="Color" />
        <TweakColor 
          label="Accent (clay)" 
          value={tweaks.accent} 
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accent', v)} 
        />
        <TweakColor 
          label="Primary (forest)" 
          value={tweaks.primary} 
          options={PRIMARY_OPTIONS}
          onChange={(v) => setTweak('primary', v)} 
        />
        
        <TweakSection label="Type" />
        <TweakSelect 
          label="Headline serif" 
          value={tweaks.headlineFont}
          options={['Newsreader', 'Spectral', 'Cormorant Garamond', 'EB Garamond', 'Playfair Display']}
          onChange={(v) => setTweak('headlineFont', v)}
        />
        
        <TweakSection label="Hero image" />
        <TweakSelect 
          label="Photo" 
          value={HERO_OPTIONS.find(h => h.val === tweaks.heroImg)?.label || HERO_OPTIONS[0].label}
          options={HERO_OPTIONS.map(h => h.label)}
          onChange={(v) => {
            const found = HERO_OPTIONS.find(h => h.label === v);
            if (found) setTweak('heroImg', found.val);
          }}
        />
      </TweaksPanel>
    </div>
  );
};
