'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchOffers, createOffer, deleteOffer, Offer } from '@/lib/data';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    id: '',
    tag: 'Early Bird',
    title: '',
    sub: '',
    code: '',
    img: '',
    accent: '#d4a853',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchOffers();
      setOffers(data);
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
      await createOffer(newOffer);
      setShowModal(false);
      setNewOffer({
        id: '', tag: 'Early Bird', title: '', sub: '', code: '',
        img: '',
        accent: '#d4a853',
      });
      await loadData();
    } catch (e) {
      alert('Failed to create offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete offer "${id}"?`)) return;
    try {
      await deleteOffer(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete offer');
    }
  };

  const filteredOffers = offers.filter(o => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      o.title.toLowerCase().includes(q) ||
      o.sub.toLowerCase().includes(q) ||
      o.tag.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q)
    );
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
              placeholder="Search offers…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{border:'none', outline:'none', background:'transparent', font:'inherit', color:'inherit', width:'100%'}}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13}/> New offer
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Offers & Promotions</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {offers.length} active promotion{offers.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading offers…</div>
            ) : offers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="tag" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No offers yet. Click "New offer" to create one.</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Offer</th>
                    <th>Subtitle</th>
                    <th>Tag</th>
                    <th>Promo Code</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map(o => (
                    <tr key={o.id}>
                      <td>
                        <div style={{display:'flex', alignItems:'center', gap:12}}>
                          <div style={{
                            width:40, height:40, borderRadius:4,
                            backgroundImage:`url(${o.img})`, backgroundSize:'cover', backgroundPosition:'center',
                            border: `2px solid ${o.accent}`, flexShrink: 0
                          }} />
                          <span style={{fontWeight:500}}>{o.title}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--ink-2)', maxWidth:240, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{o.sub}</td>
                      <td>
                        <span style={{
                          background:'rgba(235,110,75,0.1)', color:'var(--clay)',
                          padding:'3px 10px', borderRadius:20, fontSize:11,
                          fontFamily:'var(--mono)', letterSpacing:'0.04em', textTransform:'uppercase'
                        }}>{o.tag}</span>
                      </td>
                      <td>
                        <code style={{
                          background:'var(--sand)', padding:'4px 10px', borderRadius:4,
                          fontFamily:'var(--mono)', fontSize:12, letterSpacing:'0.08em'
                        }}>{o.code}</code>
                      </td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{padding:'4px 8px', color:'#c79a4a'}} onClick={() => handleDelete(o.id)}>
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

      {/* ── Create Offer Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:520, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>New Promotional Offer</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Offer ID (slug)</label>
                  <input required placeholder="monsoon-15" value={newOffer.id} onChange={e => setNewOffer({...newOffer, id: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Tag</label>
                  <select value={newOffer.tag} onChange={e => setNewOffer({...newOffer, tag: e.target.value})}>
                    <option value="Early Bird">Early Bird</option>
                    <option value="Flash Sale">Flash Sale</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Referral">Referral</option>
                    <option value="Limited">Limited</option>
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label>Title</label>
                <input required placeholder="Monsoon Magic — 15% off Kerala" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Subtitle / Description</label>
                <input required placeholder="Book before June 30 for departures Jul — Sep" value={newOffer.sub} onChange={e => setNewOffer({...newOffer, sub: e.target.value})}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Promo Code</label>
                  <input required placeholder="MONSOON15" value={newOffer.code} onChange={e => setNewOffer({...newOffer, code: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Accent Color</label>
                  <input type="color" value={newOffer.accent} onChange={e => setNewOffer({...newOffer, accent: e.target.value})} style={{height:38, padding:2, cursor:'pointer'}}/>
                </div>
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={newOffer.img} onChange={e => setNewOffer({...newOffer, img: e.target.value})}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
