'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import {
  fetchPackages, createPackage, deletePackage, updatePackage, Package, ItineraryDay,
  fetchPackageReviews, createPackageReview, deletePackageReview, PackageReview,
  fetchDestinations, Destination, fetchRegions, Region
} from '@/lib/data';

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
  highlights: string[];
  itinerary: ItineraryDay[];
};

type NewPkgForm = {
  id: string;
  title: string;
  destination: string;
  region: string;
  type: string;
  duration: number;
  nights: number;
  price: number;
  priceWas: number | undefined;
  blurb: string;
  img: string;
  gallery: string[];
  highlights: string[];
  rating: number;
  reviews: number;
};

const emptyNewPkg: NewPkgForm = {
  id: '',
  title: '',
  destination: '',
  region: '',
  type: 'Cultural',
  duration: 5,
  nights: 4,
  price: 1500,
  priceWas: undefined,
  blurb: '',
  img: '',
  gallery: [],
  highlights: [],
  rating: 5,
  reviews: 0,
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
    highlights: p.highlights ? [...p.highlights] : [],
    itinerary: p.itinerary ? p.itinerary.map(d => ({ title: d.title, body: d.body, activities: [...d.activities] })) : [],
  };
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPkg, setNewPkg] = useState<NewPkgForm>(emptyNewPkg);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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
    fetchDestinations().then(setDestinations).catch(console.error);
    fetchRegions().then(setRegions).catch(console.error);
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
    setReviews([]);
    setNewReview({ name: '', quote: '', rating: 5 });
    loadReviews(p.id);
  };

  const closeEdit = () => {
    setEditing(null);
    setForm(null);
    setSaveError('');
    setReviews([]);
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
        highlights: form.highlights.filter(h => h.trim()),
        itinerary: form.itinerary,
      });
      await loadData();
      closeEdit();
    } catch (e) {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => f ? { ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value } : f);
  };

  // ── Highlights ("what's included") ──
  const addHighlight = () => setForm(f => f ? { ...f, highlights: [...f.highlights, ''] } : f);
  const updateHighlight = (i: number, value: string) => setForm(f => f ? { ...f, highlights: f.highlights.map((h, idx) => idx === i ? value : h) } : f);
  const removeHighlight = (i: number) => setForm(f => f ? { ...f, highlights: f.highlights.filter((_, idx) => idx !== i) } : f);

  // ── Itinerary (day by day) ──
  const addItineraryDay = () => setForm(f => f ? { ...f, itinerary: [...f.itinerary, { title: '', body: '', activities: [] }] } : f);
  const updateItineraryDay = (i: number, patch: Partial<ItineraryDay>) => setForm(f => f ? {
    ...f, itinerary: f.itinerary.map((d, idx) => idx === i ? { ...d, ...patch } : d)
  } : f);
  const removeItineraryDay = (i: number) => setForm(f => f ? { ...f, itinerary: f.itinerary.filter((_, idx) => idx !== i) } : f);

  // ── Reviews ──
  const [reviews, setReviews] = useState<PackageReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', quote: '', rating: 5 });
  const [addingReview, setAddingReview] = useState(false);

  const loadReviews = async (packageId: string) => {
    setLoadingReviews(true);
    try {
      const data = await fetchPackageReviews(packageId);
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddReview = async () => {
    if (!editing || !newReview.name.trim() || !newReview.quote.trim()) return;
    setAddingReview(true);
    try {
      await createPackageReview({ package: editing.id, name: newReview.name.trim(), quote: newReview.quote.trim(), rating: newReview.rating });
      setNewReview({ name: '', quote: '', rating: 5 });
      await loadReviews(editing.id);
    } catch (e) {
      alert('Failed to add review');
    } finally {
      setAddingReview(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!editing) return;
    if (!confirm('Delete this review?')) return;
    try {
      await deletePackageReview(id);
      await loadReviews(editing.id);
    } catch (e) {
      alert('Failed to delete review');
    }
  };

  // ── Gallery images ("+N Photos" on the customer site) ──
  const [managingImages, setManagingImages] = useState<Package | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [savingImages, setSavingImages] = useState(false);
  const [imagesError, setImagesError] = useState('');

  const openImages = (p: Package) => {
    setManagingImages(p);
    setGalleryUrls(p.gallery ? [...p.gallery] : []);
    setImagesError('');
  };

  const closeImages = () => {
    setManagingImages(null);
    setGalleryUrls([]);
    setImagesError('');
  };

  const addImageUrl = () => setGalleryUrls(u => [...u, '']);
  const updateImageUrl = (i: number, value: string) => setGalleryUrls(u => u.map((url, idx) => idx === i ? value : url));
  const removeImageUrl = (i: number) => setGalleryUrls(u => u.filter((_, idx) => idx !== i));

  const handleSaveImages = async () => {
    if (!managingImages) return;
    setSavingImages(true);
    setImagesError('');
    try {
      await updatePackage(managingImages.id, { gallery: galleryUrls.map(u => u.trim()).filter(Boolean) });
      await loadData();
      closeImages();
    } catch (e) {
      setImagesError('Failed to save images. Please try again.');
    } finally {
      setSavingImages(false);
    }
  };

  const openCreate = () => {
    setNewPkg({ ...emptyNewPkg, destination: destinations[0]?.name ?? '', region: regions[0]?.name ?? '' });
    setCreateError('');
    setShowCreateModal(true);
  };

  const closeCreate = () => {
    setShowCreateModal(false);
    setCreateError('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await createPackage(newPkg);
      setShowCreateModal(false);
      setNewPkg(emptyNewPkg);
      await loadData();
    } catch (e) {
      console.error(e);
      setCreateError('Failed to create package. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const filteredPackages = packages.filter(p => {
    if (destinationFilter !== 'All' && p.destination !== destinationFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.destination.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
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
                placeholder="Search packages…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{border:'none', outline:'none', background:'transparent', font:'inherit', color:'inherit', width:'100%'}}
              />
            </div>
            <select
              value={destinationFilter}
              onChange={e => setDestinationFilter(e.target.value)}
              style={{
                padding:'8px 14px', background:'#f4ede0', border:'none', borderRadius:4,
                fontSize:13, color:'var(--muted)', fontFamily:'var(--sans)', outline:'none'
              }}
            >
              <option value="All">All destinations</option>
              {destinations.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Icon name="plus" size={13}/> New package
          </button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Packages</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {filteredPackages.length} of {packages.length} package{packages.length !== 1 ? 's' : ''}.
              </p>
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
                    <th style={{textAlign:'center'}}>Featured</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map(p => (
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
                      <td style={{fontFamily:'var(--serif)', fontSize:15}}>₹{p.price.toLocaleString()}</td>
                      <td style={{textAlign:'center'}}>
                        {p.featured ? (
                          <Icon name="check" size={14} stroke={2.5} style={{color:'var(--forest)'}} />
                        ) : (
                          <Icon name="x" size={14} stroke={2.5} style={{color:'var(--muted)'}} />
                        )}
                      </td>
                      <td style={{textAlign:'right'}}>
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openEdit(p)}>Edit</button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => openImages(p)}>
                            Images {p.gallery && p.gallery.length > 0 ? `(${p.gallery.length})` : ''}
                          </button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>No packages found.</td>
                    </tr>
                  )}
                  {packages.length > 0 && filteredPackages.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>No packages match your search or filter.</td>
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
                  <select value={form.destination} onChange={set('destination')}>
                    <option value="" disabled>Select a destination…</option>
                    {destinations.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Region">
                  <select value={form.region} onChange={set('region')}>
                    <option value="" disabled>Select a region…</option>
                    {regions.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Type">
                <select value={form.type} onChange={set('type')}>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Culinary">Culinary</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Family">Family</option>
                  <option value="Luxury">Luxury</option>
                </select>
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
                <Field label="Discounted Price (₹)">
                  <input type="number" min={0} value={form.price} onChange={set('price')} />
                </Field>
                <Field label="Original Price (₹)">
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

              <Field label="Blurb/Overview">
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
              <p style={{margin:0, fontSize:12, color:'var(--muted)'}}>
                Only 3 packages can be featured at once. If 3 are already featured, featuring this one will automatically unfeature one of the others.
              </p>

              <div style={{borderTop:'1px solid var(--line)', margin:'8px 0'}} />

              {/* What's included (highlights) */}
              <div>
                <p style={sectionLabelStyle}>What's included</p>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {form.highlights.map((h, i) => (
                    <div key={i} style={{display:'flex', gap:8, alignItems:'center'}}>
                      <input
                        value={h}
                        onChange={e => updateHighlight(i, e.target.value)}
                        placeholder="e.g. Heritage haveli stays"
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:32, height:32, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)'}}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                  ))}
                  {form.highlights.length === 0 && (
                    <p style={{fontSize:12, color:'var(--muted)', margin:0}}>No included items yet.</p>
                  )}
                  <button type="button" className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start'}} onClick={addHighlight}>
                    <Icon name="plus" size={12}/> Add item
                  </button>
                </div>
              </div>

              <div style={{borderTop:'1px solid var(--line)', margin:'8px 0'}} />

              {/* Itinerary (day by day) */}
              <div>
                <p style={sectionLabelStyle}>Itinerary (day by day)</p>
                <div style={{display:'flex', flexDirection:'column', gap:16}}>
                  {form.itinerary.map((day, i) => (
                    <div key={i} style={{border:'1px solid var(--line)', borderRadius:4, padding:14, display:'flex', flexDirection:'column', gap:10}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Day {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(i)}
                          style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)'}}
                        >
                          <Icon name="x" size={11} />
                        </button>
                      </div>
                      <input
                        value={day.title}
                        onChange={e => updateItineraryDay(i, { title: e.target.value })}
                        placeholder="Day title, e.g. Arrival in the Pink City"
                        style={inputStyle}
                      />
                      <textarea
                        value={day.body}
                        onChange={e => updateItineraryDay(i, { body: e.target.value })}
                        placeholder="What happens this day…"
                        rows={3}
                        style={{...inputStyle, resize:'vertical'}}
                      />
                      <input
                        value={day.activities.join(', ')}
                        onChange={e => updateItineraryDay(i, { activities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="Activities, comma-separated e.g. Private transfer, Heritage dinner"
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  {form.itinerary.length === 0 && (
                    <p style={{fontSize:12, color:'var(--muted)', margin:0}}>No itinerary days yet.</p>
                  )}
                  <button type="button" className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start'}} onClick={addItineraryDay}>
                    <Icon name="plus" size={12}/> Add day
                  </button>
                </div>
              </div>

              <div style={{borderTop:'1px solid var(--line)', margin:'8px 0'}} />

              {/* Reviews */}
              <div>
                <p style={sectionLabelStyle}>Reviews</p>
                {loadingReviews ? (
                  <p style={{fontSize:12, color:'var(--muted)'}}>Loading reviews…</p>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:14}}>
                    {reviews.length === 0 && (
                      <p style={{fontSize:12, color:'var(--muted)', margin:0}}>No reviews yet for this package.</p>
                    )}
                    {reviews.map(r => (
                      <div key={r.id} style={{border:'1px solid var(--line)', borderRadius:4, padding:12, display:'flex', justifyContent:'space-between', gap:10}}>
                        <div>
                          <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
                            <span style={{fontWeight:500, fontSize:13}}>{r.name}</span>
                            <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--clay)'}}>{r.rating.toFixed(1)}★</span>
                          </div>
                          <p style={{fontSize:13, color:'var(--ink-2)', margin:0}}>{r.quote}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(r.id)}
                          style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:26, height:26, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)'}}
                        >
                          <Icon name="x" size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{border:'1px dashed var(--line-2)', borderRadius:4, padding:12, display:'flex', flexDirection:'column', gap:8}}>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 90px', gap:8}}>
                    <input
                      value={newReview.name}
                      onChange={e => setNewReview(r => ({...r, name: e.target.value}))}
                      placeholder="Reviewer name"
                      style={inputStyle}
                    />
                    <input
                      type="number" min={1} max={5} step={0.5}
                      value={newReview.rating}
                      onChange={e => setNewReview(r => ({...r, rating: parseFloat(e.target.value) || 5}))}
                      style={inputStyle}
                    />
                  </div>
                  <textarea
                    value={newReview.quote}
                    onChange={e => setNewReview(r => ({...r, quote: e.target.value}))}
                    placeholder="What did they say about this trip?"
                    rows={2}
                    style={{...inputStyle, resize:'vertical'}}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{alignSelf:'flex-start'}}
                    onClick={handleAddReview}
                    disabled={addingReview || !newReview.name.trim() || !newReview.quote.trim()}
                  >
                    <Icon name="plus" size={12}/> {addingReview ? 'Adding…' : 'Add review'}
                  </button>
                </div>
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

      {/* Create package modal */}
      {showCreateModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(28,25,22,0.6)',
          backdropFilter:'blur(4px)', display:'flex', alignItems:'center',
          justifyContent:'center', zIndex:1000, padding:24
        }}>
          <div style={{
            background:'var(--paper)', border:'1px solid var(--line)',
            borderRadius:8, padding:32, maxWidth:600, width:'100%',
            boxShadow:'0 20px 40px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto'
          }}>
            <h3 style={{fontSize:24, marginBottom:20}}>Add New Travel Package</h3>
            <form onSubmit={handleCreate} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Package ID (slug)</label>
                  <input required placeholder="jaipur-escape" value={newPkg.id} onChange={e => setNewPkg({...newPkg, id: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Trip Title</label>
                  <input required placeholder="Jaipur Heritage Escape" value={newPkg.title} onChange={e => setNewPkg({...newPkg, title: e.target.value})}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Destination City/Area</label>
                  <select required value={newPkg.destination} onChange={e => setNewPkg({...newPkg, destination: e.target.value})}>
                    <option value="" disabled>Select a destination…</option>
                    {destinations.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field-group">
                  <label>Region</label>
                  <select required value={newPkg.region} onChange={e => setNewPkg({...newPkg, region: e.target.value})}>
                    <option value="" disabled>Select a region…</option>
                    {regions.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Trip Type</label>
                  <select value={newPkg.type} onChange={e => setNewPkg({...newPkg, type: e.target.value})}>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culinary">Culinary</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Family">Family</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Duration (Days)</label>
                  <input required type="number" min={1} value={newPkg.duration} onChange={e => setNewPkg({...newPkg, duration: parseInt(e.target.value) || 0})}/>
                </div>
                <div className="field-group">
                  <label>Nights</label>
                  <input required type="number" min={0} value={newPkg.nights} onChange={e => setNewPkg({...newPkg, nights: parseInt(e.target.value) || 0})}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Discounted Price per person (₹)</label>
                  <input required type="number" min={0} value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: parseInt(e.target.value) || 0})}/>
                </div>
                <div className="field-group">
                  <label>Original Price (optional)</label>
                  <input type="number" min={0} value={newPkg.priceWas ?? ''} onChange={e => setNewPkg({...newPkg, priceWas: e.target.value ? (parseInt(e.target.value) || 0) : undefined})}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Rating</label>
                  <input type="number" min={0} max={5} step={0.1} value={newPkg.rating} onChange={e => setNewPkg({...newPkg, rating: parseFloat(e.target.value) || 0})}/>
                </div>
                <div className="field-group">
                  <label>Reviews</label>
                  <input type="number" min={0} value={newPkg.reviews} onChange={e => setNewPkg({...newPkg, reviews: parseInt(e.target.value) || 0})}/>
                </div>
              </div>
              <div className="field-group">
                <label>Blurb/Overview</label>
                <textarea required style={{minHeight: 80, padding: 12}} placeholder="Describe the trip mood and layout..." value={newPkg.blurb} onChange={e => setNewPkg({...newPkg, blurb: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input placeholder="https://images.unsplash.com/..." value={newPkg.img} onChange={e => setNewPkg({...newPkg, img: e.target.value})}/>
              </div>
              {newPkg.img && (
                <div style={{borderRadius:4, overflow:'hidden', height:120, backgroundImage:`url(${newPkg.img})`, backgroundSize:'cover', backgroundPosition:'center', border:'1px solid var(--line)'}} />
              )}
              {createError && <span style={{fontSize:13, color:'#b8443a'}}>{createError}</span>}
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={closeCreate} disabled={creating}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Images modal — the "+N Photos" gallery shown on each package's detail page */}
      {managingImages && (
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
            <p style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4}}>Manage images</p>
            <h3 style={{fontSize:22, marginBottom:6}}>{managingImages.title}</h3>
            <p style={{fontSize:13, color:'var(--muted)', marginBottom:20}}>
              These are the gallery photos shown on the trip's detail page (the "+N Photos" preview).
            </p>

            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {galleryUrls.map((url, i) => (
                <div key={i} style={{display:'flex', gap:10, alignItems:'center'}}>
                  <div style={{
                    width:44, height:44, borderRadius:4, flexShrink:0,
                    backgroundImage: url ? `url(${url})` : undefined,
                    backgroundSize:'cover', backgroundPosition:'center',
                    background: url ? undefined : 'var(--sand)',
                    border:'1px solid var(--line)',
                  }} />
                  <input
                    value={url}
                    onChange={e => updateImageUrl(i, e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    style={{background:'transparent', border:'1px solid var(--line-2)', borderRadius:4, width:32, height:32, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)'}}
                  >
                    <Icon name="x" size={12} />
                  </button>
                </div>
              ))}
              {galleryUrls.length === 0 && (
                <p style={{fontSize:13, color:'var(--muted)', margin:0}}>No gallery images yet. Add one below.</p>
              )}
              <button type="button" className="btn btn-ghost btn-sm" style={{alignSelf:'flex-start'}} onClick={addImageUrl}>
                <Icon name="plus" size={12}/> Add image
              </button>
            </div>

            {imagesError && <p style={{fontSize:13, color:'#b8443a', marginTop:16}}>{imagesError}</p>}

            <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:24}}>
              <button type="button" className="btn btn-ghost" onClick={closeImages} disabled={savingImages}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveImages} disabled={savingImages}>
                {savingImages ? 'Saving…' : 'Save images'}
              </button>
            </div>
          </div>
        </div>
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

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ink)',
  marginBottom: 12,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:5}}>
      <label style={{
        fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.12em',
        textTransform:'uppercase', color:'var(--muted)',
      }}>{label}</label>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type === 'input' || child.type === 'textarea' || child.type === 'select')) {
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
