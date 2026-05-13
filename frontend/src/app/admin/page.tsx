'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PACKAGES, BOOKINGS } from '@/lib/data';

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

function BookingChart() {
  const monthly = [42, 48, 55, 51, 64, 71, 78, 85, 73, 88, 96, 142];
  const labels = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
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

export default function AdminPage() {
  const navItems = [
    { sec: 'General' },
    { ic: 'home', label: 'Dashboard', active: true, href: '/admin' },
    { ic: 'package', label: 'Packages', count: 26, href: '/admin/packages' },
    { ic: 'inbox', label: 'Bookings', count: 142, href: '/admin/bookings' },
    { ic: 'users', label: 'Customers', href: '/admin/customers' },
    { sec: 'Marketing' },
    { ic: 'tag', label: 'Offers & promotions', count: 4, href: '/admin/offers' },
    { ic: 'globe', label: 'Destinations', href: '/admin/destinations' },
    { ic: 'mail', label: 'Newsletters', href: '/admin/newsletters' },
    { sec: 'Insights' },
    { ic: 'chart', label: 'Analytics', href: '/admin/analytics' },
    { ic: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-brand">
          Kushmud<span className="dot" style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--clay)', transform:'translateY(-3px)'}}></span>
          <span className="tag" style={{marginLeft:'auto'}}>Admin</span>
        </div>
        <nav className="admin-nav">
          {navItems.map((it, i) =>
            it.sec
              ? <div key={i} className="admin-nav-section">{it.sec}</div>
              : <Link key={i} href={it.href || '#'} className={it.active ? 'active' : ''}>
                  <span className="ic"><Icon name={it.ic || 'home'} size={14}/></span>
                  <span style={{flex:1}}>{it.label}</span>
                  {it.count && <span style={{fontFamily:'var(--mono)', fontSize:10, color:'rgba(244,237,224,0.5)'}}>{it.count}</span>}
                </Link>
          )}
        </nav>
        <div className="admin-side-foot">
          <div className="admin-avatar" style={{ backgroundImage:'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop)' }}></div>
          <div>
            <div className="name">Naomi Field</div>
            <div className="role">Asia Editor</div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search bookings, packages, customers…</span>
            <span style={{marginLeft:'auto', fontFamily:'var(--mono)', fontSize:10, padding:'2px 6px', background:'white', border:'1px solid var(--line)', borderRadius:3}}>⌘ K</span>
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <Link href="/" className="btn btn-ghost btn-sm">← View site</Link>
            <button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New package</button>
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
              <button className="btn btn-ghost btn-sm">Export</button>
            </div>
          </div>

          <div className="kpis">
            <div className="kpi">
              <div className="lbl">Total bookings</div>
              <div className="v">142</div>
              <div className="delta up">▲ 12.4% vs. last month</div>
              <Spark color="#1f7a4d"/>
            </div>
            <div className="kpi">
              <div className="lbl">Revenue (MTD)</div>
              <div className="v">$284k</div>
              <div className="delta up">▲ 8.1% vs. last month</div>
              <Spark color="#1f3b30"/>
            </div>
            <div className="kpi">
              <div className="lbl">Pending inquiries</div>
              <div className="v">17</div>
              <div className="delta down">▼ 3 since yesterday</div>
              <Spark color="#c79a4a" inverse/>
            </div>
            <div className="kpi">
              <div className="lbl">Avg. trip rating</div>
              <div className="v">4.87</div>
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
                <BookingChart/>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h4>Top packages</h4>
                <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase'}}>This month</span>
              </div>
              <div className="panel-body" style={{padding:0}}>
                {PACKAGES.slice(0,5).map((p, i) => (
                  <div key={p.id} style={{display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i < 4 ? '1px solid var(--line)' : 0}}>
                    <div style={{width:48, height:48, borderRadius:2, backgroundImage:`url(${p.img})`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0}}></div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13.5, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.title}</div>
                      <div style={{fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:2}}>{Math.floor(40 - i*6)} bookings</div>
                    </div>
                    <div style={{fontFamily:'var(--serif)', fontSize:16, letterSpacing:'-0.01em'}}>${(p.price * (10-i)).toLocaleString()}</div>
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
                <button className="btn btn-ghost btn-sm">View all →</button>
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
                {BOOKINGS.map(b => (
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
                    <td><span className={'status ' + b.status}><span className="d"></span>{b.status}</span></td>
                    <td style={{textAlign:'right', fontFamily:'var(--serif)', fontSize:15, letterSpacing:'-0.005em'}}>${b.total.toLocaleString()}</td>
                    <td style={{textAlign:'right', color:'var(--muted)'}}>···</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
