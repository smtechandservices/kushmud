'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchNewsletterSubscribers, deleteNewsletterSubscriber, NewsletterSubscriber } from '@/lib/data';

export default function NewslettersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchNewsletterSubscribers();
      setSubscribers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (s: NewsletterSubscriber) => {
    if (!confirm(`Remove "${s.email}" from the newsletter list?`)) return;
    try {
      await deleteNewsletterSubscriber(s.id);
      await loadData();
    } catch (e) {
      alert('Failed to delete subscriber');
    }
  };

  const filteredSubscribers = subscribers.filter(s => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return s.email.toLowerCase().includes(q);
  });

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <input
              type="text"
              placeholder="Search subscribers…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Newsletter Subscribers</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          {/* KPI summary cards */}
          <div className="kpis" style={{marginBottom: 24}}>
            <div className="kpi">
              <div className="lbl">Total Subscribers</div>
              <div className="v">{subscribers.length}</div>
            </div>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading subscribers…</div>
            ) : subscribers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="mail" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No subscribers yet. They&apos;ll appear here when visitors sign up on the site.</p>
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Subscribed</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map(s => (
                    <tr key={s.id}>
                      <td style={{fontWeight:500}}>{s.email}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>
                        {new Date(s.subscribed_at).toLocaleDateString()}
                      </td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{padding:'4px 8px', color:'#c79a4a'}} onClick={() => handleDelete(s)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
