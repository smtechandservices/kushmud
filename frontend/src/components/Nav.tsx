'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { isCustomerLoggedIn, fetchCustomerMe, customerLogout, Customer } from '@/lib/data';

export const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (isCustomerLoggedIn()) {
      fetchCustomerMe().then(setCustomer).catch(() => customerLogout());
    }
  }, [pathname]);

  const handleLogout = () => {
    customerLogout();
    setCustomer(null);
    router.push('/');
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-wrap">
            <span className="brand-name">Kushmud</span>
            <span className="brand-sub">Travel &amp; Tourism</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
          <Link href="/packages" className={pathname === '/packages' ? 'active' : ''}>Packages</Link>
          <Link href="/destinations" className={pathname === '/destinations' ? 'active' : ''}>Destinations</Link>
          <Link href="/stories" className={pathname === '/stories' ? 'active' : ''}>Stories</Link>
          <Link href="/about" className={pathname === '/about' ? 'active' : ''}>About</Link>
        </div>
        <div className="nav-actions" style={{display:'flex', alignItems:'center', gap:14}}>
          {customer ? (
            <>
              <span style={{fontSize:13, color:'var(--ink-2)'}}>Hi, {customer.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Log out</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
          )}
          <Link href="/packages" className="btn btn-primary btn-sm">
            Plan a trip
          </Link>
        </div>
      </div>
    </nav>
  );
};
