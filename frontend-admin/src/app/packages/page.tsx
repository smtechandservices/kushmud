'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchPackages, deletePackage, Package } from '@/lib/data';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchPackages();
      setPackages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete package ${id}?`)) return;
    try {
      await deletePackage(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete package');
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search packages…</span>
          </div>
          <button className="btn btn-primary btn-sm">
            <Icon name="plus" size={13}/> New package
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Packages</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Manage travel itineraries and pricing.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>Loading packages...</div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Destination</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                          <div style={{width: 32, height: 32, borderRadius: 4, backgroundImage: `url(${p.img})`, backgroundSize: 'cover'}} />
                          <span style={{fontWeight: 500}}>{p.title}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{p.destination}</td>
                      <td>{p.type}</td>
                      <td>{p.duration} days</td>
                      <td style={{fontFamily:'var(--serif)', fontSize:15}}>${p.price.toLocaleString()}</td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px'}} onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>No packages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
