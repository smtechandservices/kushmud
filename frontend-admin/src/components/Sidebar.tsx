'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';
import navItems from '@/assets/admin-nav.json';
import { logout, fetchMe, AdminUser } from '@/lib/data';

export function Sidebar() {
  const pathname = usePathname();
  const [me, setMe] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchMe().then(setMe).catch(() => {});
  }, []);

  const displayName = me ? (me.first_name ? `${me.first_name} ${me.last_name}`.trim() : me.username) : '';
  const initials = displayName ? displayName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() : '';

  return (
    <aside className="admin-side">
      <div className="admin-brand">
        Kushmud<span className="dot" style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--clay)', transform:'translateY(-3px)'}}></span>
        <span className="tag" style={{marginLeft:'auto'}}>Admin</span>
      </div>
      <nav className="admin-nav">
        {navItems.map((it, i) => {
          if (it.sec) {
            return <div key={i} className="admin-nav-section">{it.sec}</div>;
          }
          
          const isActive = pathname === it.href || (pathname !== '/' && it.href !== '/' && pathname.startsWith(it.href || ''));
          
          return (
            <Link key={i} href={it.href || '#'} className={isActive ? 'active' : ''}>
              <span className="ic"><Icon name={it.ic || 'home'} size={14}/></span>
              <span style={{flex:1}}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="admin-side-foot" style={{flexDirection: 'column', gap: 16}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%'}}>
          <div className="admin-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clay)', color: 'white', fontFamily: 'var(--mono)', fontSize: 12 }}>{initials}</div>
          <div>
            <div className="name">{displayName || 'Loading…'}</div>
            <div className="role">Admin</div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="btn btn-ghost" 
          style={{width: '100%', fontSize: 13, color: 'var(--muted)', justifyContent: 'flex-start', padding: '6px 8px'}}
        >
          <Icon name="x" size={12} style={{marginRight: 8}}/> Sign out
        </button>
      </div>
    </aside>
  );
}
