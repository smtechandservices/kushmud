'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';

export default function SettingsPage() {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search settings…</span>
          </div>
          <button className="btn btn-primary btn-sm">
            Save Changes
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Settings</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Manage team access and platform configuration.</p>
            </div>
          </div>
          <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
            <Icon name="settings" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
            <p>Settings configuration panel.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
