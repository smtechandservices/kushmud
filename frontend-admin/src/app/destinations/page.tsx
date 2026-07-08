'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchDestinations, createDestination, updateDestination, deleteDestination, fetchRegions, Destination, Region } from '@/lib/data';

const BLANK_DEST = {
  name: '',
  region: '',
  img: '',
  tag: 'Explore',
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [newDest, setNewDest] = useState(BLANK_DEST);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');

  const loadData = async () => {
    try {
      const data = await fetchDestinations();
      setDestinations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    fetchRegions().then(setRegions).catch(console.error);
  }, []);

  const openCreateModal = () => {
    setEditingName(null);
    setNewDest({ ...BLANK_DEST, region: regions[0]?.name ?? '' });
    setShowModal(true);
  };

  const openEditModal = (d: Destination) => {
    setEditingName(d.name);
    setNewDest({ name: d.name, region: d.region, img: d.img, tag: d.tag });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...newDest };
      if (editingName) {
        await updateDestination(editingName, payload);
      } else {
        await createDestination(payload);
      }
      setShowModal(false);
      setEditingName(null);
      setNewDest(BLANK_DEST);
      await loadData();
    } catch (e) {
      alert(editingName ? 'Failed to update destination' : 'Failed to create destination');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete destination "${name}"?`)) return;
    try {
      await deleteDestination(name);
      await loadData();
    } catch (e) {
      alert('Failed to delete destination');
    }
  };

  const filteredDestinations = destinations.filter(d => {
    if (regionFilter !== 'All' && d.region !== regionFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div className="admin-search">
              <Icon name="search" size={14}/>
              <input
                type="text"
                placeholder="Search destinations…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{border:'none', outline:'none', background:'transparent', font:'inherit', color:'inherit', width:'100%'}}
              />
            </div>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              style={{
                padding:'8px 14px', background:'#f4ede0', border:'none', borderRadius:4,
                fontSize:13, color:'var(--muted)', fontFamily:'var(--sans)', outline:'none'
              }}
            >
              <option value="All">All regions</option>
              {regions.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Icon name="plus" size={13}/> New destination
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Destinations</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {filteredDestinations.length} of {destinations.length} featured location{destinations.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          {loading ? (
            <div className="panel" style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading destinations…</div>
          ) : destinations.length === 0 ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              <Icon name="globe" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
              <p>No destinations yet. Click "New destination" to add one.</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
              <p>No results match your search or filter.</p>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
              {filteredDestinations.map(d => (
                <div key={d.name} className="panel" style={{padding:0, overflow:'hidden'}}>
                  <div style={{
                    height:160, backgroundImage:`url(${d.img})`,
                    backgroundSize:'cover', backgroundPosition:'center', position:'relative'
                  }}>
                    <span style={{
                      position:'absolute', top:12, left:12,
                      background:'rgba(28,25,22,0.75)', color:'white',
                      padding:'4px 12px', borderRadius:20, fontSize:11,
                      fontFamily:'var(--mono)', letterSpacing:'0.06em', textTransform:'uppercase',
                      backdropFilter:'blur(4px)'
                    }}>{d.tag}</span>
                  </div>
                  <div style={{padding:'16px 20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <h4 style={{fontSize:16, marginBottom:4}}>{d.name}</h4>
                        <span style={{fontSize:12, color:'var(--muted)', fontFamily:'var(--mono)'}}>{d.region} · {d.count} packages</span>
                      </div>
                      <div style={{display:'flex', gap:4}}>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{padding:'4px 8px'}}
                          onClick={() => openEditModal(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{padding:'4px 8px', color:'#c79a4a'}}
                          onClick={() => handleDelete(d.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Create / Edit Destination Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:480, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>{editingName ? 'Edit Destination' : 'Add New Destination'}</h3>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Destination Name</label>
                <input required disabled={!!editingName} placeholder="Goa, India" value={newDest.name} onChange={e => setNewDest({...newDest, name: e.target.value})}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Region</label>
                  <select required value={newDest.region} onChange={e => setNewDest({...newDest, region: e.target.value})}>
                    <option value="" disabled>Select a region…</option>
                    {regions.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Package Count</label>
                  <input
                    disabled
                    value={editingName ? `${destinations.find(d => d.name === editingName)?.count ?? 0} (auto)` : 'Set after creating'}
                    style={{color: 'var(--muted)'}}
                  />
                </div>
              </div>
              <p style={{margin:'-4px 0 0', fontSize:12, color:'var(--muted)'}}>
                Package count is calculated automatically from packages that list this destination
              </p>
              <div className="field-group">
                <label>Tag</label>
                <select value={newDest.tag} onChange={e => setNewDest({...newDest, tag: e.target.value})}>
                  <option value="Explore">Explore</option>
                  <option value="Trending">Trending</option>
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Beach">Beach</option>
                </select>
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={newDest.img} onChange={e => setNewDest({...newDest, img: e.target.value})}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditingName(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingName ? 'Save Changes' : 'Add Destination'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
