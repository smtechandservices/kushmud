'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchRegions, createRegion, deleteRegion, fetchDestinations, Region, Destination } from '@/lib/data';

export default function RegionsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const [regionData, destinationData] = await Promise.all([fetchRegions(), fetchDestinations()]);
      setRegions(regionData);
      setDestinations(destinationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreateModal = () => {
    setNewName('');
    setCreateError('');
    setShowModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await createRegion({ name: newName.trim() });
      setShowModal(false);
      setNewName('');
      await loadData();
    } catch (e) {
      setCreateError('Failed to create region. It may already exist.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (name: string) => {
    const inUse = destinations.some(d => d.region === name);
    if (inUse) {
      alert(`Can't delete "${name}" — one or more destinations are still assigned to it.`);
      return;
    }
    if (!confirm(`Delete region "${name}"?`)) return;
    try {
      await deleteRegion(name);
      await loadData();
    } catch (e) {
      alert('Failed to delete region');
    }
  };

  const filteredRegions = regions.filter(r => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q);
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
              placeholder="Search regions…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{border:'none', outline:'none', background:'transparent', font:'inherit', color:'inherit', width:'100%'}}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Icon name="plus" size={13}/> New region
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Regions</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {regions.length} region{regions.length !== 1 ? 's' : ''}. Destinations are grouped under these when added.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading regions…</div>
            ) : regions.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="compass" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No regions yet. Click "New region" to add one.</p>
              </div>
            ) : filteredRegions.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Destinations</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegions.map(r => (
                    <tr key={r.name}>
                      <td style={{fontWeight:500}}>{r.name}</td>
                      <td style={{color:'var(--ink-2)'}}>{destinations.filter(d => d.region === r.name).length}</td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{padding:'4px 8px', color:'#c79a4a'}} onClick={() => handleDelete(r.name)}>
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

      {/* ── Create Region Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:420, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>Add New Region</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Region Name</label>
                <input required autoFocus placeholder="e.g. Thailand" value={newName} onChange={e => setNewName(e.target.value)}/>
              </div>
              {createError && <span style={{fontSize:13, color:'#b8443a'}}>{createError}</span>}
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={creating}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating || !newName.trim()}>
                  {creating ? 'Creating…' : 'Add Region'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
