'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';

export default function AnalyticsPage() {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search reports…</span>
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Analytics</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Detailed insights on revenue and engagement.</p>
            </div>
            <button className="btn btn-ghost btn-sm">Generate Report</button>
          </div>
          <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
            <Icon name="chart" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
            <p>Advanced analytics dashboard coming soon.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
