'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { 
  PACKAGES, BOOKINGS, 
  fetchStats, fetchBookings, createPackage, updateBookingStatus,
  Package, Booking 
} from '@/lib/data';
import chartData from '@/assets/admin-chart.json';
import { Sidebar } from '@/components/Sidebar';

function Spark({ color = '#1f7a4d', inverse = false }) {
  const points = inverse
    ? [10, 8, 14, 11, 16, 13, 9, 12, 7, 10, 6, 8]
    : [4, 7, 5, 9, 6, 11, 8, 14, 10, 16, 13, 18];
  const max = 20;
  const w = 220, h = 32;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => {
    const x = i * step;
    const y = h - (p / max) * h;
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  const area = path + ` L${w},${h} L0,${h} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={32}>
      <path d={area} fill={color} opacity={0.12}/>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface BookingChartProps {
  monthly?: number[];
  labels?: string[];
}

function BookingChart({ monthly = chartData.monthly, labels = chartData.labels }: BookingChartProps) {
  const max = 160;
  const w = 800, h = 220;
  const step = w / (monthly.length - 1);
  const path = monthly.map((v, i) => {
    const x = i * step;
    const y = h - (v / max) * h;
    return (i === 0 ? 'M' : 'L') + x + ',' + y.toFixed(1);
  }).join(' ');
  const area = path + ` L${w},${h} L0,${h} Z`;
  return (
    <div style={{position:'relative'}}>
      <svg viewBox={`0 0 ${w} ${h+30}`} preserveAspectRatio="none" width="100%" height={250}>
        {[0, 0.25, 0.5, 0.75, 1].map(f =>
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--line)" strokeDasharray="2 4"/>
        )}
        <path d={area} fill="var(--clay)" opacity={0.08}/>
        <path d={path} fill="none" stroke="var(--clay)" strokeWidth={2} strokeLinecap="round"/>
        {monthly.map((v, i) => {
          const x = i * step;
          const y = h - (v / max) * h;
          return <circle key={i} cx={x} cy={y} r={i === monthly.length - 1 ? 5 : 3} fill={i === monthly.length - 1 ? 'var(--clay)' : 'var(--paper)'} stroke="var(--clay)" strokeWidth={1.5}/>;
        })}
        {labels.map((l, i) =>
          <text key={l} x={i * step} y={h + 22} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fill="#756e63" letterSpacing="0.5">{l.toUpperCase()}</text>
        )}
      </svg>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [packages, setPackages] = useState<Package[]>(PACKAGES);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newPkg, setNewPkg] = useState({
    id: '',
    title: '',
    destination: '',
    region: 'India',
    type: 'Cultural',
    duration: 5,
    nights: 4,
    price: 1500,
    priceWas: undefined as number | undefined,
    blurb: '',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop'
    ],
    highlights: ['Heritage tour', 'Private transport', 'Selected luxury stays']
  });

  const loadData = async () => {
    try {
      const freshStats = await fetchStats();
      setStats(freshStats);
    } catch (e) {
      console.error('Failed to load live stats, using mock settings.', e);
    }

    try {
      const freshBookings = await fetchBookings();
      if (freshBookings && freshBookings.length > 0) {
        setBookings(freshBookings);
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus(id, newStatus);
      await loadData();
    } catch (e) {
      console.error(e);
      alert('Failed to update booking status');
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPackage(newPkg);
      setShowModal(false);
      // Reset form
      setNewPkg({
        id: '',
        title: '',
        destination: '',
        region: 'India',
        type: 'Cultural',
        duration: 5,
        nights: 4,
        price: 1500,
        priceWas: undefined,
        blurb: '',
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
        gallery: [
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop'
        ],
        highlights: ['Heritage tour', 'Private transport', 'Selected luxury stays']
      });
      await loadData();
      alert('Package created successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to create package');
    }
  };

  // Default fallback KPIs
  const kpis = stats?.kpis || {
    total_bookings: bookings.length,
    revenue_mtd: '$284k',
    pending_inquiries: bookings.filter(b => b.status === 'pending').length,
    avg_rating: 4.87
  };

  // Top packages defaults or dynamic
  const topPackagesList = stats?.top_packages || PACKAGES.slice(0, 5).map((p, i) => ({
    id: p.id,
    title: p.title,
    img: p.img,
    price: p.price,
    bookings: Math.floor(40 - i * 6)
  }));

  return (
    <div className="admin">
      <Sidebar />

      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search bookings, packages, customers…</span>
            <span style={{marginLeft:'auto', fontFamily:'var(--mono)', fontSize:10, padding:'2px 6px', background:'white', border:'1px solid var(--line)', borderRadius:3}}>⌘ K</span>
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <Link href="http://localhost:3000" className="btn btn-ghost btn-sm">← View site</Link>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <Icon name="plus" size={13}/> New package
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Good morning, Naomi.</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Today is Tuesday, 6 May. Spring season is 76% booked.</p>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn btn-ghost btn-sm">Last 30 days <Icon name="arrow-right" size={11} stroke={2}/></button>
              <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
            </div>
          </div>

          <div className="kpis">
            <div className="kpi">
              <div className="lbl">Total bookings</div>
              <div className="v">{kpis.total_bookings}</div>
              <div className="delta up">▲ 12.4% vs. last month</div>
              <Spark color="#1f7a4d"/>
            </div>
            <div className="kpi">
              <div className="lbl">Revenue (MTD)</div>
              <div className="v">{kpis.revenue_mtd}</div>
              <div className="delta up">▲ 8.1% vs. last month</div>
              <Spark color="#1f3b30"/>
            </div>
            <div className="kpi">
              <div className="lbl">Pending inquiries</div>
              <div className="v">{kpis.pending_inquiries}</div>
              <div className="delta down">▼ 3 since yesterday</div>
              <Spark color="#c79a4a" inverse/>
            </div>
            <div className="kpi">
              <div className="lbl">Avg. trip rating</div>
              <div className="v">{kpis.avg_rating}</div>
              <div className="delta up">▲ 0.04</div>
              <Spark color="#1f3b30"/>
            </div>
          </div>

          <div className="admin-grid">
            <div className="panel">
              <div className="panel-head">
                <h4>Booking trend</h4>
                <div style={{display:'flex', gap:6, fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--muted)'}}>
                  <span style={{color:'var(--ink)', borderBottom:'1px solid var(--ink)', paddingBottom:2}}>30d</span>
                  <span>·</span><span>90d</span>
                  <span>·</span><span>1y</span>
                </div>
              </div>
              <div className="panel-body" style={{paddingBottom:18}}>
                <BookingChart monthly={stats?.chart?.monthly} labels={stats?.chart?.labels} />
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h4>Top packages</h4>
                <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase'}}>This month</span>
              </div>
              <div className="panel-body" style={{padding:0}}>
                {topPackagesList.map((p: any, i: number) => (
                  <div key={p.id} style={{display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i < topPackagesList.length - 1 ? '1px solid var(--line)' : 0}}>
                    <div style={{width:48, height:48, borderRadius:2, backgroundImage:`url(${p.img})`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0}}></div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13.5, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.title}</div>
                      <div style={{fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:2}}>{p.bookings} bookings</div>
                    </div>
                    <div style={{fontFamily:'var(--serif)', fontSize:16, letterSpacing:'-0.01em'}}>${p.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{height:24}}></div>

          <div className="panel">
            <div className="panel-head">
              <h4>Recent bookings</h4>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <div className="admin-search" style={{width:240, padding:'6px 12px', fontSize:12}}>
                  <Icon name="search" size={12}/><span>Filter…</span>
                </div>
                <button className="btn btn-ghost btn-sm"><Icon name="filter" size={12}/> Filter</button>
                <button className="btn btn-ghost btn-sm" onClick={loadData}>View all →</button>
              </div>
            </div>
            <table className="dtable">
              <thead>
                <tr>
                  <th><input type="checkbox" style={{margin:0}} readOnly/></th>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th style={{textAlign:'right'}}>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><input type="checkbox" style={{margin:0}} readOnly/></td>
                    <td><span style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)'}}>{b.id}</span></td>
                    <td>
                      <div className="who">
                        <div className="ava" style={{ backgroundImage:`url(${b.avatar})` }}></div>
                        <span>{b.name}</span>
                      </div>
                    </td>
                    <td style={{color:'var(--ink-2)'}}>{b.pkg}</td>
                    <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{b.dates}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span className={'status ' + b.status}><span className="d"></span>{b.status}</span>
                        {b.status === 'pending' && (
                          <div style={{display:'inline-flex', gap:4}}>
                            <button 
                              className="btn btn-sm btn-ghost" 
                              style={{padding: '2px 6px', fontSize: 10, background: 'rgba(31,122,77,0.1)', color: 'var(--forest)', height: 'auto'}}
                              onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                            >
                              Confirm
                            </button>
                            <button 
                              className="btn btn-sm btn-ghost" 
                              style={{padding: '2px 6px', fontSize: 10, background: 'rgba(199,154,74,0.1)', color: '#c79a4a', height: 'auto'}}
                              onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{textAlign:'right', fontFamily:'var(--serif)', fontSize:15, letterSpacing:'-0.005em'}}>${b.total.toLocaleString()}</td>
                    <td style={{textAlign:'right', color:'var(--muted)'}}>···</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Modal overlay for creating new package ── */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,22,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24
        }}>
          <div style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            padding: 32,
            maxWidth: 600,
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{fontSize: 24, marginBottom: 20}}>Add New Travel Package</h3>
            <form onSubmit={handleCreatePackage} style={{display:'flex', flexDirection:'column', gap:16}}>
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
                  <input required placeholder="Jaipur, India" value={newPkg.destination} onChange={e => setNewPkg({...newPkg, destination: e.target.value})}/>
                </div>
                <div className="field-group">
                  <label>Region</label>
                  <select value={newPkg.region} onChange={e => setNewPkg({...newPkg, region: e.target.value})}>
                    <option value="India">India</option>
                    <option value="UAE">UAE</option>
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
                  <input required type="number" value={newPkg.duration} onChange={e => setNewPkg({...newPkg, duration: parseInt(e.target.value) || 0})}/>
                </div>
                <div className="field-group">
                  <label>Nights</label>
                  <input required type="number" value={newPkg.nights} onChange={e => setNewPkg({...newPkg, nights: parseInt(e.target.value) || 0})}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="field-group">
                  <label>Price per person ($)</label>
                  <input required type="number" value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: parseInt(e.target.value) || 0})}/>
                </div>
                <div className="field-group">
                  <label>Original Price (optional)</label>
                  <input type="number" value={newPkg.priceWas || ''} onChange={e => setNewPkg({...newPkg, priceWas: parseInt(e.target.value) || undefined})}/>
                </div>
              </div>
              <div className="field-group">
                <label>Blurb/Overview</label>
                <textarea required style={{minHeight: 80, padding: 12}} placeholder="Describe the trip mood and layout..." value={newPkg.blurb} onChange={e => setNewPkg({...newPkg, blurb: e.target.value})}/>
              </div>
              <div className="field-group">
                <label>Cover Image URL</label>
                <input required placeholder="https://images.unsplash.com/..." value={newPkg.img} onChange={e => setNewPkg({...newPkg, img: e.target.value})}/>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12}}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
