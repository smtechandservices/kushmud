'use client';

import React from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { CurrencyProvider } from '@/context/CurrencyContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CurrencyProvider>
      {children}
    </CurrencyProvider>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CurrencyProvider>
      <div className="app">
        <Nav />
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
};
