'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchFaqs, createFaq, updateFaq, deleteFaq, FAQ } from '@/lib/data';

type EditForm = {
  question: string;
  answer: string;
  category: string;
  order: string;
};

function toForm(f: FAQ): EditForm {
  return {
    question: f.question,
    answer: f.answer,
    category: f.category ?? '',
    order: String(f.order),
  };
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: '',
    order: '0',
  });

  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  const filteredFaqs = sortedFaqs.filter(f => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      (f.category ?? '').toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setNewFaq({ question: '', answer: '', category: '', order: String(faqs.length) });
    setShowModal(true);
  };

  const closeCreate = () => {
    setShowModal(false);
    setNewFaq({ question: '', answer: '', category: '', order: String(faqs.length) });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFaq({
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category || null,
        order: parseInt(newFaq.order, 10) || 0,
      });
      closeCreate();
      await loadData();
    } catch (e) {
      alert('Failed to create FAQ');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await deleteFaq(id);
      await loadData();
    } catch (e) {
      alert('Failed to delete FAQ');
    }
  };

  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm(toForm(f));
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
      await updateFaq(editing.id, {
        question: form.question,
        answer: form.answer,
        category: form.category || null,
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

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => f ? { ...f, [key]: e.target.value } : f);
  };

  const truncate = (text: string, len: number) => (text.length > len ? `${text.slice(0, len)}…` : text);

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <input
              type="text"
              placeholder="Search FAQs…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={13}/> New FAQ
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>FAQs</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {faqs.length} question{faqs.length !== 1 ? 's' : ''} in the knowledge base.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading FAQs…</div>
            ) : sortedFaqs.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="help-circle" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No FAQs yet. Click "New FAQ" to create one.</p>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="search" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No results match your search.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Category</th>
                    <th>Order</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaqs.map(f => (
                    <tr key={f.id}>
                      <td style={{fontWeight:500, maxWidth:260}}>{f.question}</td>
                      <td style={{color:'var(--ink-2)', maxWidth:320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                        {truncate(f.answer, 80)}
                      </td>
                      <td>
                        {f.category ? (
                          <span style={{
                            background:'rgba(235,110,75,0.1)', color:'var(--clay)',
                            padding:'3px 10px', borderRadius:20, fontSize:11,
                            fontFamily:'var(--mono)', letterSpacing:'0.04em', textTransform:'uppercase'
                          }}>{f.category}</span>
                        ) : (
                          <span style={{color:'var(--muted)', fontSize:12}}>—</span>
                        )}
                      </td>
                      <td style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--muted)'}}>{f.order}</td>
                      <td style={{textAlign:'right'}}>
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openEdit(f)}>Edit</button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDelete(f.id)}>Delete</button>
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

      {/* ── Create FAQ Modal ── */}
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
            <h3 style={{fontSize:24, marginBottom:20}}>New FAQ</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="field-group">
                <label>Question</label>
                <input required placeholder="How do I cancel a booking?" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Answer</label>
                <textarea required rows={4} placeholder="You can cancel a booking from…" value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} style={{resize:'vertical'}}/>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Category</label>
                  <input placeholder="Bookings (optional)" value={newFaq.category} onChange={e => setNewFaq({...newFaq, category: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Order</label>
                  <input type="number" min={0} value={newFaq.order} onChange={e => setNewFaq({...newFaq, order: e.target.value})}/>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={closeCreate}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create FAQ</button>
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
                <p style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4}}>Editing FAQ</p>
                <h4 style={{fontSize:17, margin:0}}>{editing.question}</h4>
              </div>
              <button onClick={closeEdit} style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)', fontSize:18, lineHeight:1}}>×</button>
            </div>

            {/* Form fields */}
            <div style={{padding:'24px 28px', display:'flex', flexDirection:'column', gap:18, flex:1}}>

              <Field label="Question">
                <input value={form.question} onChange={set('question')} />
              </Field>

              <Field label="Answer">
                <textarea value={form.answer} onChange={set('answer')} rows={6} style={{resize:'vertical'}} />
              </Field>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <Field label="Category">
                  <input value={form.category} onChange={set('category')} placeholder="Optional" />
                </Field>
                <Field label="Order">
                  <input type="number" min={0} value={form.order} onChange={set('order')} />
                </Field>
              </div>

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
