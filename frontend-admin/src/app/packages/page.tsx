'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchPackages, deletePackage, updatePackage, Package } from '@/lib/data';

type EditForm = {
  title: string;
  destination: string;
  region: string;
  type: string;
  duration: string;
  nights: string;
  price: string;
  priceWas: string;
  rating: string;
  reviews: string;
  featured: boolean;
  badge: string;
  blurb: string;
  img: string;
};

function toForm(p: Package): EditForm {
  return {
    title: p.title,
    destination: p.destination,
    region: p.region,
    type: p.type,
    duration: String(p.duration),
    nights: String(p.nights),
    price: String(p.price),
    priceWas: p.priceWas != null ? String(p.priceWas) : '',
    rating: String(p.rating),
    reviews: String(p.reviews),
    featured: p.featured ?? false,
    badge: p.badge ?? '',
    blurb: p.blurb,
    img: p.img,
  };
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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

  const openEdit = (p: Package) => {
    setEditing(p);
    setForm(toForm(p));
    setSaveError('');
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!editing || !form) return;
    setSaving(true);
    setSaveError('');
    try {
      await updatePackage(editing.id, {
        title: form.title,
        destination: form.destination,
        region: form.region,
        type: form.type,
        duration: parseInt(form.duration, 10),
        nights: parseInt(form.nights, 10),
        price: parseInt(form.price, 10),
        priceWas: form.priceWas ? parseInt(form.priceWas, 10) : undefined,
        rating: parseFloat(form.rating),
        reviews: parseInt(form.reviews, 10),
        featured: form.featured,
        badge: form.badge || undefined,
        blurb: form.blurb,
        img: form.img,
      });
      await loadData();
      closeEdit();
    } catch (e) {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => f ? { ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value } : f);
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
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openEdit(p)}>Edit</button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
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

      {/* Edit drawer */}
      {editing && form && (
        <>
          <div
            onClick={closeEdit}
            style={{position:'fixed', inset:0, background:'rgba(28,25,22,0.38)', zIndex:40, backdropFilter:'blur(2px)'}}
          />
          <div style={{
            position:'fixed', top:0, right:0, bottom:0, width:480,
            background:'white', zIndex:50,
            boxShadow:'-8px 0 40px rgba(28,25,22,0.14)',
            display:'flex', flexDirection:'column',
            overflowY:'auto',
          }}>
            {/* Drawer header */}
            <div style={{
              padding:'20px 28px', borderBottom:'1px solid var(--line)',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              position:'sticky', top:0, background:'white', zIndex:2,
            }}>
              <div>
                <p style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4}}>Editing package</p>
                <h4 style={{fontSize:17, margin:0}}>{editing.title}</h4>
              </div>
              <button onClick={closeEdit} style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1}}>×</button>
            </div>

            {/* Form fields */}
            <div style={{padding:'24px 28px', display:'flex', flexDirection:'column', gap:18, flex:1}}>

              <Field label="Title">
                <input value={form.title} onChange={set('title')} />
              </Field>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Destination">
                  <input value={form.destination} onChange={set('destination')} />
                </Field>
                <Field label="Region">
                  <input value={form.region} onChange={set('region')} />
                </Field>
              </div>

              <Field label="Type">
                <input value={form.type} onChange={set('type')} placeholder="e.g. Cultural, Adventure" />
              </Field>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Duration (days)">
                  <input type="number" min={1} value={form.duration} onChange={set('duration')} />
                </Field>
                <Field label="Nights">
                  <input type="number" min={0} value={form.nights} onChange={set('nights')} />
                </Field>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Price ($)">
                  <input type="number" min={0} value={form.price} onChange={set('price')} />
                </Field>
                <Field label="Was price ($)">
                  <input type="number" min={0} value={form.priceWas} onChange={set('priceWas')} placeholder="Optional" />
                </Field>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Rating">
                  <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={set('rating')} />
                </Field>
                <Field label="Reviews">
                  <input type="number" min={0} value={form.reviews} onChange={set('reviews')} />
                </Field>
              </div>

              <Field label="Badge">
                <input value={form.badge} onChange={set('badge')} placeholder="e.g. Best seller (optional)" />
              </Field>

              <Field label="Image URL">
                <input value={form.img} onChange={set('img')} />
              </Field>

              {form.img && (
                <div style={{borderRadius:4, overflow:'hidden', height:120, backgroundImage:`url(${form.img})`, backgroundSize:'cover', backgroundPosition:'center', border:'1px solid var(--line)'}} />
              )}

              <Field label="Blurb">
                <textarea value={form.blurb} onChange={set('blurb')} rows={4} style={{resize:'vertical'}} />
              </Field>

              <label style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer', fontSize:14}}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => f ? {...f, featured: e.target.checked} : f)}
                  style={{width:15, height:15, accentColor:'var(--forest)'}}
                />
                Featured package
              </label>

            </div>

            {/* Drawer footer */}
            <div style={{
              padding:'16px 28px', borderTop:'1px solid var(--line)',
              position:'sticky', bottom:0, background:'white',
              display:'flex', gap:10, alignItems:'center',
            }}>
              {saveError && <span style={{fontSize:13, color:'#b8443a', flex:1}}>{saveError}</span>}
              {!saveError && <span style={{flex:1}} />}
              <button className="btn btn-ghost btn-sm" onClick={closeEdit} disabled={saving}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--line-2)',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'var(--sans)',
  color: 'var(--ink)',
  background: 'var(--paper)',
  outline: 'none',
  width: '100%',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:5}}>
      <label style={{
        fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em',
        textTransform:'uppercase', color:'var(--muted)',
      }}>{label}</label>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type === 'input' || child.type === 'textarea')) {
          const existingStyle = (child.props as React.HTMLAttributes<HTMLElement>).style ?? {};
          return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
            style: { ...inputStyle, ...existingStyle },
          });
        }
        return child;
      })}
    </div>
  );
}
