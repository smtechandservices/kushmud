'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from './Icon';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token && pathname !== '/login') {
      router.replace('/login');
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--sand)'}}>
        <div style={{display:'flex', alignItems:'center', gap:10, color:'var(--muted)', fontSize:14, fontFamily:'var(--mono)'}}>
          <Icon name="lock" size={16} /> Authenticating...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
