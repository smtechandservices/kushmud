'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icon';
import navItems from '@/assets/admin-nav.json';
import { logout } from '@/lib/data';

export function Sidebar() {
  const pathname = usePathname();

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
          <div className="admin-avatar" style={{ backgroundImage:'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop)' }}></div>
          <div>
            <div className="name">Naomi Field</div>
            <div className="role">Asia Editor</div>
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
