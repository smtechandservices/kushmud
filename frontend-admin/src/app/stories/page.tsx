'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchStories, createStory, updateStory, deleteStory, Story } from '@/lib/data';

type EditForm = {
  title: string;
  tag: string;
  author: string;
  img: string;
  excerpt: string;
  body: string;
};

function toForm(s: Story): EditForm {
  return {
    title: s.title,
    tag: s.tag ?? '',
    author: s.author ?? '',
    img: s.img,
    excerpt: s.excerpt,
    body: s.body ?? '',
  };
}

const emptyNewStory = {
  title: '',
  tag: '',
  author: '',
  img: '',
  excerpt: '',
  body: '',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newStory, setNewStory] = useState(emptyNewStory);
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchStories();
      setStories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createStory({
        title: newStory.title,
        tag: newStory.tag || undefined,
        author: newStory.author || undefined,
        img: newStory.img,
        excerpt: newStory.excerpt,
        body: newStory.body || undefined,
      });
      setShowModal(false);
      setNewStory(emptyNewStory);
      await loadData();
    } catch (e) {
      alert('Failed to create story');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      await deleteStory(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete story');
    }
  };

  const openEdit = (s: Story) => {
    setEditing(s);
    setForm(toForm(s));
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
      await updateStory(editing.id, {
        title: form.title,
        tag: form.tag || undefined,
        author: form.author || undefined,
        img: form.img,
        excerpt: form.excerpt,
        body: form.body || undefined,
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
    setForm(f => f ? { ...f, [key]: e.target.value } : f);
  };

  const filteredStories = stories.filter(s => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q) ||
      (s.author ?? '').toLowerCase().includes(q) ||
      (s.tag ?? '').toLowerCase().includes(q)
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
              placeholder="Search stories…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={13}/> New story
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Stories</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {stories.length} stor{stories.length !== 1 ? 'ies' : 'y'} published.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading stories…</div>
            ) : stories.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="book" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No stories yet. Click "New story" to publish one.</p>
              </div>
            ) : filteredStories.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Story</th>
                    <th>Tag</th>
                    <th>Author</th>
                    <th>Published</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                          <div style={{width: 40, height: 40, borderRadius: 4, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0}} />
                          <span style={{fontWeight: 500}}>{s.title}</span>
                        </div>
                      </td>
                      <td>
                        {s.tag ? (
                          <span style={{
                            background:'rgba(235,110,75,0.1)', color:'var(--clay)',
                            padding:'3px 10px', borderRadius:20, fontSize:11,
                            fontFamily:'var(--mono)', letterSpacing:'0.04em', textTransform:'uppercase'
                          }}>{s.tag}</span>
                        ) : (
                          <span style={{color:'var(--muted)'}}>—</span>
                        )}
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{s.author || '—'}</td>
                      <td style={{color:'var(--ink-2)'}}>{formatDate(s.published_at)}</td>
                      <td style={{textAlign:'right'}}>
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openEdit(s)}>Edit</button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDelete(s.id)}>Delete</button>
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

      {/* ── Create Story Modal ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:560, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>New Story</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Title</label>
                <input required placeholder="A Week Wandering the Kerala Backwaters" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Tag</label>
                  <input placeholder="e.g. Travel Journal" value={newStory.tag} onChange={e => setNewStory({...newStory, tag: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Author</label>
                  <input placeholder="e.g. Priya Nair" value={newStory.author} onChange={e => setNewStory({...newStory, author: e.target.value})}/>
                </div>
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input required placeholder="https://images.unsplash.com/…" value={newStory.img} onChange={e => setNewStory({...newStory, img: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Excerpt</label>
                <textarea required rows={3} style={{resize:'vertical'}} placeholder="Short teaser shown in story listings…" value={newStory.excerpt} onChange={e => setNewStory({...newStory, excerpt: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Body (optional)</label>
                <textarea rows={6} style={{resize:'vertical'}} placeholder="Full story content…" value={newStory.body} onChange={e => setNewStory({...newStory, body: e.target.value})}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={creating}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Publishing…' : 'Publish Story'}</button>
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
                <p style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4}}>Editing story</p>
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
                <Field label="Tag">
                  <input value={form.tag} onChange={set('tag')} placeholder="e.g. Travel Journal" />
                </Field>
                <Field label="Author">
                  <input value={form.author} onChange={set('author')} placeholder="Optional" />
                </Field>
              </div>

              <Field label="Cover Image URL">
                <input value={form.img} onChange={set('img')} />
              </Field>

              {form.img && (
                <div style={{borderRadius:4, overflow:'hidden', height:120, backgroundImage:`url(${form.img})`, backgroundSize:'cover', backgroundPosition:'center', border:'1px solid var(--line)'}} />
              )}

              <Field label="Excerpt">
                <textarea value={form.excerpt} onChange={set('excerpt')} rows={4} style={{resize:'vertical'}} />
              </Field>

              <Field label="Body">
                <textarea value={form.body} onChange={set('body')} rows={10} style={{resize:'vertical'}} placeholder="Optional — full story content" />
              </Field>

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
