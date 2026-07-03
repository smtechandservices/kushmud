'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchTestimonials, createTestimonial, deleteTestimonial, Testimonial } from '@/lib/data';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    place: '',
    avatar: '',
    quote: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
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
      await createTestimonial(newTestimonial);
      setShowModal(false);
      setNewTestimonial({
        name: '', place: '', quote: '',
        avatar: '',
      });
      await loadData();
    } catch (e) {
      alert('Failed to create testimonial');
    }
  };

  const handleDelete = async (t: Testimonial) => {
    const id = (t as any).id;
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    try {
      await deleteTestimonial(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.place.toLowerCase().includes(q) ||
      t.quote.toLowerCase().includes(q)
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
              placeholder="Search testimonials…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{border:'none', outline:'none', background:'transparent', font:'inherit', color:'inherit', width:'100%'}}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13}/> New testimonial
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Testimonials</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading testimonials…</div>
            ) : testimonials.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="star" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No testimonials yet. Click "New testimonial" to add one.</p>
              </div>
            ) : filteredTestimonials.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Place</th>
                    <th>Quote</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestimonials.map(t => (
                    <tr key={(t as any).id}>
                      <td>
                        <div style={{display:'flex', alignItems:'center', gap:12}}>
                          <div style={{
                            width:36, height:36, borderRadius:'50%',
                            backgroundImage:`url(${t.avatar})`, backgroundSize:'cover', backgroundPosition:'center',
                            flexShrink: 0
                          }} />
                          <span style={{fontWeight:500}}>{t.name}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{t.place}</td>
                      <td style={{color:'var(--ink-2)', maxWidth:360, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.quote}</td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" style={{padding:'4px 8px', color:'#c79a4a'}} onClick={() => handleDelete(t)}>
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

      {/* ── Create Testimonial Modal ── */}
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
            <h3 style={{fontSize:24, marginBottom:20}}>New Testimonial</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Name</label>
                  <input required placeholder="Anjali Menon" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Place</label>
                  <input required placeholder="Kochi, Kerala" value={newTestimonial.place} onChange={e => setNewTestimonial({...newTestimonial, place: e.target.value})}/>
                </div>
              </div>
              <div className="field-group">
                <label>Avatar Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={newTestimonial.avatar} onChange={e => setNewTestimonial({...newTestimonial, avatar: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Quote</label>
                <textarea required rows={4} placeholder="Our trip was unforgettable — every detail was taken care of…" value={newTestimonial.quote} onChange={e => setNewTestimonial({...newTestimonial, quote: e.target.value})}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
