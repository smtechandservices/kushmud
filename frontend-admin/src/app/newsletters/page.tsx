'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';

export default function NewslettersPage() {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search subscribers…</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <Icon name="mail" size={13}/> Compose
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Newsletters</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Manage subscriber list and campaign drafts.</p>
            </div>
          </div>
          <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
            <Icon name="mail" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
            <p>No recent newsletter campaigns.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
