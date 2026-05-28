'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchDestinations, createDestination, deleteDestination, Destination } from '@/lib/data';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDest, setNewDest] = useState({
    name: '',
    count: 0,
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop',
    tag: 'Explore',
    size: '',
  });

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

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...newDest };
      if (!payload.size) delete (payload as any).size;
      await createDestination(payload);
      setShowModal(false);
      setNewDest({
        name: '', count: 0,
        img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop',
        tag: 'Explore', size: '',
      });
      await loadData();
    } catch (e) {
      alert('Failed to create destination');
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

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search destinations…</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13}/> New destination
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Destinations</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {destinations.length} featured location{destinations.length !== 1 ? 's' : ''}.
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
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20}}>
              {destinations.map(d => (
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
                    {d.size === 'lg' && (
                      <span style={{
                        position:'absolute', top:12, right:12,
                        background:'var(--clay)', color:'white',
                        padding:'4px 10px', borderRadius:20, fontSize:10,
                        fontFamily:'var(--mono)', letterSpacing:'0.06em', textTransform:'uppercase'
                      }}>Featured</span>
                    )}
                  </div>
                  <div style={{padding:'16px 20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <h4 style={{fontSize:16, marginBottom:4}}>{d.name}</h4>
                        <span style={{fontSize:12, color:'var(--muted)', fontFamily:'var(--mono)'}}>{d.count} packages</span>
                      </div>
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
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Create Destination Modal ── */}
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
            <h3 style={{fontSize:24, marginBottom:20}}>Add New Destination</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Destination Name</label>
                <input required placeholder="Goa, India" value={newDest.name} onChange={e => setNewDest({...newDest, name: e.target.value})}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Package Count</label>
                  <input type="number" required value={newDest.count} onChange={e => setNewDest({...newDest, count: parseInt(e.target.value) || 0})}/>
                </div>
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
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={newDest.img} onChange={e => setNewDest({...newDest, img: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Size (leave blank for normal, enter "lg" for featured)</label>
                <select value={newDest.size} onChange={e => setNewDest({...newDest, size: e.target.value})}>
                  <option value="">Normal</option>
                  <option value="lg">Featured (Large)</option>
                </select>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Destination</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
