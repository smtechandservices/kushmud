'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/Icon';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

export default function ListingPage() {
  const [filters, setFilters] = useState<Record<string, boolean>>({ Cultural: true, Adventure: true });
  const toggle = (k: string) => setFilters({ ...filters, [k]: !filters[k] });
  const types = ['Cultural', 'Adventure', 'Culinary', 'Wellness', 'Family'];
  const regions = [
    { name: 'India', count: 4 },
    { name: 'UAE', count: 2 },
  ];

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>All Packages</span></div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
            <div>
              <h1 style={{fontSize:64}}>All Trips, <em style={{fontStyle:'italic'}}>everywhere we go.</em></h1>
              <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>Filter by region, mood, or duration. Each trip is a starting point — every itinerary can be tailored.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="listing">
          <aside className="filters">
            <div className="filter-group">
              <h5>Filters <button onClick={() => setFilters({})}>Clear all</button></h5>
            </div>
            <div className="filter-group">
              <h5>Trip type</h5>
              {types.map(tp =>
                <div key={tp} className={'fopt fopt-check ' + (filters[tp] ? 'on' : '')} onClick={() => toggle(tp)}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span className="box">{filters[tp] && <Icon name="check" size={9} stroke={3}/>}</span>
                    <span>{tp}</span>
                  </div>
                  <span className="fopt-count">{Math.floor(Math.random()*15)+3}</span>
                </div>
              )}
            </div>
            <div className="filter-group">
              <h5>Region</h5>
              {regions.map(r =>
                <div key={r.name} className={'fopt fopt-check ' + (filters[r.name] ? 'on' : '')} onClick={() => toggle(r.name)}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span className="box">{filters[r.name] && <Icon name="check" size={9} stroke={3}/>}</span>
                    <span>{r.name}</span>
                  </div>
                  <span className="fopt-count">{r.count}</span>
                </div>
              )}
            </div>
            <div className="filter-group">
              <h5>Price range</h5>
              <div className="range">
                <div className="range-bar">
                  <div className="knob" style={{left:'15%'}}></div>
                  <div className="knob" style={{left:'70%'}}></div>
                </div>
                <div className="range-vals"><span>$1,200</span><span>$8,400</span></div>
              </div>
            </div>
            <div className="filter-group">
              <h5>Duration</h5>
              {['3-5 days', '6-9 days', '10-14 days', '15+ days'].map(d =>
                <div key={d} className={'fopt fopt-check ' + (filters[d] ? 'on' : '')} onClick={() => toggle(d)}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span className="box">{filters[d] && <Icon name="check" size={9} stroke={3}/>}</span>
                    <span>{d}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="filter-group">
              <h5>Travel month</h5>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:4}}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m,i) =>
                  <div key={m} style={{
                    padding:'6px 0', textAlign:'center', fontSize:12,
                    border:'1px solid var(--line-2)', borderRadius:2,
                    background: [3,4].includes(i) ? 'var(--forest)' : 'var(--paper)',
                    color: [3,4].includes(i) ? 'white' : 'var(--ink-2)',
                    cursor:'pointer',
                    fontFamily:'var(--mono)', letterSpacing:'0.05em'
                  }}>{m}</div>
                )}
              </div>
            </div>
          </aside>

          <div className="listing-results">
            <div className="listing-toolbar">
              <span className="listing-count"><strong>{PACKAGES.length}</strong> trips · sorted by editor's pick</span>
              <div className="sort">
                <span className="mono">Sort:</span>
                <span>Editor's pick</span>
                <Icon name="arrow-right" size={12} stroke={2}/>
              </div>
            </div>
            <div className="listing-tags">
              <span className="tag">Cultural <button><Icon name="x" size={12}/></button></span>
              <span className="tag">Adventure <button><Icon name="x" size={12}/></button></span>
              <span className="tag">Apr - May <button><Icon name="x" size={12}/></button></span>
              <span className="tag">$1,200 - $5,500 <button><Icon name="x" size={12}/></button></span>
            </div>
            <div className="cards" style={{gridTemplateColumns:'repeat(2, 1fr)'}}>
              {PACKAGES.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>
            <div style={{display:'flex', justifyContent:'center', marginTop:64, gap:8}}>
              <button className="btn btn-ghost btn-sm">‹ Prev</button>
              <button className="btn btn-primary btn-sm">1</button>
              <button className="btn btn-ghost btn-sm">2</button>
              <button className="btn btn-ghost btn-sm">3</button>
              <button className="btn btn-ghost btn-sm">Next ›</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
