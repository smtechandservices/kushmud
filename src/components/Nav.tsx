'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';

export const Nav: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          Kushmud<span className="dot"></span>
        </Link>
        <div className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/packages" className={pathname === '/packages' ? 'active' : ''}>Packages</Link>
          <Link href="/destinations" className={pathname === '/destinations' ? 'active' : ''}>Destinations</Link>
          <Link href="/stories" className={pathname === '/stories' ? 'active' : ''}>Stories</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
        </div>
        <div className="nav-actions">
          <Link href="/admin" className="btn btn-ghost btn-sm">
            <Icon name="users" size={14}/> Admin
          </Link>
          <Link href="/packages" className="btn btn-primary btn-sm">
            Plan a trip
          </Link>
        </div>
      </div>
    </nav>
  );
};
