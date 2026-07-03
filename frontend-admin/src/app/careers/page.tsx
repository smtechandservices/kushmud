'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchJobOpenings, createJobOpening, updateJobOpening, deleteJobOpening, JobOpening } from '@/lib/data';

type EditForm = {
  title: string;
  location: string;
  type: string;
  order: string;
};

function toForm(j: JobOpening): EditForm {
  return {
    title: j.title,
    location: j.location,
    type: j.type,
    order: String(j.order),
  };
}

export default function CareersAdminPage() {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    order: '0',
  });

  const [editing, setEditing] = useState<JobOpening | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchJobOpenings();
      setOpenings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedOpenings = [...openings].sort((a, b) => a.order - b.order);

  const filteredOpenings = sortedOpenings.filter(j => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      j.title.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.type.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setNewJob({ title: '', location: '', type: 'Full-time', order: String(openings.length) });
    setShowModal(true);
  };

  const closeCreate = () => {
    setShowModal(false);
    setNewJob({ title: '', location: '', type: 'Full-time', order: String(openings.length) });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJobOpening({
        title: newJob.title,
        location: newJob.location,
        type: newJob.type,
        order: parseInt(newJob.order, 10) || 0,
      });
      closeCreate();
      await loadData();
    } catch (e) {
      alert('Failed to create job opening');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return;
    try {
      await deleteJobOpening(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete job opening');
    }
  };

  const openEdit = (j: JobOpening) => {
    setEditing(j);
    setForm(toForm(j));
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
      await updateJobOpening(editing.id, {
        title: form.title,
        location: form.location,
        type: form.type,
        order: parseInt(form.order, 10) || 0,
      });
      await loadData();
      closeEdit();
    } catch (e) {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => f ? { ...f, [key]: e.target.value } : f);
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <input
              type="text"
              placeholder="Search open roles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={13}/> New role
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Careers</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {openings.length} open role{openings.length !== 1 ? 's' : ''} listed on the careers page.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading open roles…</div>
            ) : sortedOpenings.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="users" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No open roles yet. Click "New role" to list one.</p>
              </div>
            ) : filteredOpenings.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Order</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpenings.map(j => (
                    <tr key={j.id}>
                      <td style={{fontWeight:500}}>{j.title}</td>
                      <td style={{color:'var(--ink-2)'}}>{j.location}</td>
                      <td>
                        <span style={{
                          background:'rgba(235,110,75,0.1)', color:'var(--clay)',
                          padding:'3px 10px', borderRadius:20, fontSize:11,
                          fontFamily:'var(--mono)', letterSpacing:'0.04em', textTransform:'uppercase'
                        }}>{j.type}</span>
                      </td>
                      <td style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--muted)'}}>{j.order}</td>
                      <td style={{textAlign:'right'}}>
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openEdit(j)}>Edit</button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDelete(j.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ── Create Job Opening Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:480, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>New Open Role</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Title</label>
                <input required placeholder="Junior Trip Planner" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Location</label>
                <input required placeholder="Brooklyn / Remote" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Type</label>
                  <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Order</label>
                  <input type="number" min={0} value={newJob.order} onChange={e => setNewJob({...newJob, order: e.target.value})}/>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={closeCreate}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit drawer */}
      {editing && form && (
        <>
          <div
            onClick={closeEdit}
            style={{position:'fixed', inset:0, background:'rgba(28,25,22,0.38)', zIndex:40, backdropFilter:'blur(2px)'}}
          />
          <div style={{
            position:'fixed', top:0, right:0, bottom:0, width:420,
            background:'white', zIndex:50,
            boxShadow:'-8px 0 40px rgba(28,25,22,0.14)',
            display:'flex', flexDirection:'column',
            overflowY:'auto',
          }}>
            <div style={{
              padding:'20px 28px', borderBottom:'1px solid var(--line)',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              position:'sticky', top:0, background:'white', zIndex:2,
            }}>
              <div>
                <p style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4}}>Editing role</p>
                <h4 style={{fontSize:17, margin:0}}>{editing.title}</h4>
              </div>
              <button onClick={closeEdit} style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1}}>×</button>
            </div>

            <div style={{padding:'24px 28px', display:'flex', flexDirection:'column', gap:18, flex:1}}>
              <Field label="Title">
                <input value={form.title} onChange={set('title')} />
              </Field>
              <Field label="Location">
                <input value={form.location} onChange={set('location')} />
              </Field>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Type">
                  <select value={form.type} onChange={set('type')} style={inputStyle}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </Field>
                <Field label="Order">
                  <input type="number" min={0} value={form.order} onChange={set('order')} />
                </Field>
              </div>
            </div>

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
        if (React.isValidElement(child) && (child.type === 'input' || child.type === 'select')) {
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
