'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchFlyers, createFlyer, updateFlyer, deleteFlyer, Flyer } from '@/lib/data';

export default function FlyersPage() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchFlyers();
      setFlyers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreateModal = () => {
    setImgUrl('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFlyer({ img: imgUrl });
      setShowModal(false);
      setImgUrl('');
      await loadData();
    } catch (e) {
      alert('Failed to create flyer');
    }
  };

  const handleDelete = async (f: Flyer) => {
    if (!confirm('Delete this flyer?')) return;
    try {
      await deleteFlyer(f.id);
      await loadData();
    } catch (e) {
      alert('Failed to delete flyer');
    }
  };

  const handleToggleVisible = async (f: Flyer) => {
    try {
      await updateFlyer(f.id, { is_visible: !f.is_visible });
      await loadData();
    } catch (e) {
      alert('Failed to update flyer');
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <span></span>
          <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
            <Icon name="plus" size={13}/> New flyer
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Flyers</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {flyers.length} flyer{flyers.length !== 1 ? 's' : ''} shown under Trending Now on the homepage.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading flyers…</div>
            ) : flyers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="sparkle" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No flyers yet. Click "New flyer" to add one.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Flyer</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flyers.map(f => (
                    <tr key={f.id} style={{ opacity: f.is_visible ? 1 : 0.5 }}>
                      <td>
                        <div style={{
                          width:56, height:56, borderRadius:4,
                          backgroundImage:`url(${f.img})`, backgroundSize:'cover', backgroundPosition:'center',
                          border: '1px solid var(--line)'
                        }} />
                      </td>
                      <td>
                        <span style={{
                          background: f.is_visible ? 'rgba(66,133,97,0.12)' : 'rgba(28,25,22,0.08)',
                          color: f.is_visible ? '#3f7a55' : 'var(--muted)',
                          padding:'3px 10px', borderRadius:20, fontSize:11,
                          fontFamily:'var(--mono)', letterSpacing:'0.04em', textTransform:'uppercase'
                        }}>{f.is_visible ? 'Visible' : 'Hidden'}</span>
                      </td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>
                        {new Date(f.created_at).toLocaleDateString()}
                      </td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{margin:2, padding:'4px 8px'}} onClick={() => handleToggleVisible(f)}>
                          {f.is_visible ? 'Hide' : 'Show'}
                        </button>
                        <button className="btn btn-sm btn-ghost" style={{margin:2, padding:'4px 8px', color:'#c79a4a'}} onClick={() => handleDelete(f)}>
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

      {/* ── Create Flyer Modal ── */}
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
            <h3 style={{fontSize:24, marginBottom:20}}>New Flyer</h3>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={imgUrl} onChange={e => setImgUrl(e.target.value)}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Flyer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
