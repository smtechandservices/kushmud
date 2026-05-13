'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PACKAGES, ITINERARY_RAJASTHAN, TESTIMONIALS } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

export default function DetailPage() {
  const { id } = useParams();
  const pkg = PACKAGES.find(p => p.id === id) || PACKAGES[0];
  
  return (
    <MainLayout>
      <div className="container" style={{paddingTop:32}}>
        <div className="crumbs" style={{marginBottom:20}}>Kushmud / {pkg.region} / <span>{pkg.title}</span></div>
        <div className="gallery">
          <div className="lg" style={{ backgroundImage: `url(${pkg.gallery?.[0] || pkg.img})` }}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[1] || pkg.img})` }}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[2] || pkg.img})` }}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[3] || pkg.img})` }}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[4] || pkg.img})`, position:'relative' }}>
            <div style={{position:'absolute', inset:0, background:'rgba(28,25,22,0.55)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase'}}>+ 18 Photos</div>
          </div>
        </div>
      </div>

      <div className="container detail">
        <div className="detail-body">
          <div>
            <span className="eyebrow"><Icon name="pin" size={11}/> {pkg.destination}</span>
            <h1 style={{marginTop:14}}>{pkg.title}</h1>
            <div style={{display:'flex', gap:12, alignItems:'center', color:'var(--ink-2)', fontSize:14}}>
              <span style={{display:'flex', alignItems:'center', gap:6}}>
                <Icon name="star" size={13} stroke={0}/> <strong style={{color:'var(--ink)'}}>{pkg.rating}</strong>
                <span style={{color:'var(--muted)'}}>({pkg.reviews} reviews)</span>
              </span>
              <span style={{color:'var(--line-2)'}}>·</span>
              <span>Curated by <strong style={{color:'var(--ink)'}}>Aanya Mehta</strong>, India editor</span>
            </div>
            <p style={{marginTop:24, fontSize:18, lineHeight:1.55, color:'var(--ink-2)', fontFamily:'var(--serif)', fontStyle:'italic'}}>
              "Rajasthan rewards repetition — Jaipur in the morning is a different city from Jaipur at dusk. This route is built for second visits as much as first ones, with mornings reserved for forts that empty by ten and evenings for the courtyards behind the bazaar."
            </p>

            <div className="detail-meta">
              <div className="item"><span className="lbl">Duration</span><span className="v">{pkg.duration} days</span></div>
              <div className="item"><span className="lbl">Group size</span><span className="v">2 — 8</span></div>
              <div className="item"><span className="lbl">Pace</span><span className="v">Slow</span></div>
              <div className="item"><span className="lbl">Best months</span><span className="v">Oct · Mar</span></div>
              <div className="item"><span className="lbl">Style</span><span className="v">Cultural</span></div>
            </div>

            <div className="detail-section">
              <h3>Day by day</h3>
              <div className="itin">
                {ITINERARY_RAJASTHAN.map((d, i) => (
                  <div key={i} className="itin-day">
                    <div className="day-label">Day<span className="num">0{i+1}</span></div>
                    <div>
                      <h4>{d.title}</h4>
                      <p>{d.body}</p>
                      <div className="activities">
                        {d.activities.map(a => <span key={a} className="activity">{a}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>What's included</h3>
              <div className="incl">
                {[
                  'All accommodation (8 nights, heritage)', 'Private chauffeur all routes',
                  'Daily breakfast + 5 dinners', 'Private guide in each city',
                  'Sunrise Amber Fort access', 'Lake Pichola private boat',
                  'Bishnoi village day-trip', 'Wayfare planner on call 24/7',
                ].map(x => (
                  <div key={x} className="incl-row"><Icon name="check" size={11} stroke={2.5} className="ic"/><span>{x}</span></div>
                ))}
                {[
                  'International flights', 'Travel insurance',
                  'Lunches & some dinners', 'Optional block-print workshop ($90)',
                ].map(x => (
                  <div key={x} className="incl-row no"><Icon name="x" size={11} stroke={2} className="ic"/><span>{x}</span></div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Reviews</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32}}>
                {[0,1].map(i => (
                  <div key={i} style={{padding:'4px 0'}}>
                    <div style={{display:'flex', gap:4, color:'var(--clay)', marginBottom:10}}>
                      {[0,1,2,3,4].map(s => <Icon key={s} name="star" size={12} stroke={0}/>)}
                    </div>
                    <p style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.4, color:'var(--ink)'}}>
                      "{TESTIMONIALS[i].quote}"
                    </p>
                    <div style={{marginTop:14, fontSize:13, color:'var(--muted)', fontFamily:'var(--mono)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                      — {TESTIMONIALS[i].name}, {TESTIMONIALS[i].place.replace('Booked: ', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="book-card">
              <div className="price-row">
                <div>
                  <div className="price">${pkg.price.toLocaleString()}</div>
                  <div className="per">per person, double occupancy</div>
                  {pkg.priceWas && <div className="strike">${pkg.priceWas.toLocaleString()}</div>}
                </div>
                {pkg.priceWas && <span className="save">Save ${(pkg.priceWas-pkg.price).toLocaleString()}</span>}
              </div>
              <div style={{marginTop:18, marginBottom:8}}>
                <div className="field">
                  <label>Departure</label>
                  <div className="v">Oct 18, 2026</div>
                </div>
                <div className="field">
                  <label>Return</label>
                  <div className="v">Oct 26, 2026</div>
                </div>
                <div className="field">
                  <label>Travelers</label>
                  <div className="v">2 adults</div>
                </div>
              </div>
              <div className="summary">
                <div className="row"><span>${pkg.price.toLocaleString()} × 2 travelers</span><span>${(pkg.price * 2).toLocaleString()}</span></div>
                <div className="row"><span>Wayfare planning fee</span><span>$0</span></div>
                <div className="row"><span>Carbon offset</span><span>$72</span></div>
                <div className="row total"><span>Total</span><span>${(pkg.price * 2 + 72).toLocaleString()}</span></div>
              </div>
              <Link href={`/checkout?pkg=${pkg.id}`} className="btn btn-clay" style={{width: '100%', marginTop: 6, padding: 16, fontSize: 15}}>
                Reserve this trip <Icon name="arrow-right" size={14}/>
              </Link>
              <button className="btn btn-ghost" style={{width:'100%', marginTop:8}}>Talk to a planner first</button>
              <div className="trust">
                <Icon name="shield" size={11}/> Fully bonded · No charge until you confirm
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
