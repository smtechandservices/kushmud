'use client';

import React from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app">
      <Nav />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
};
