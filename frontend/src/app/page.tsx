'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PackageCard } from '@/components/PackageCard';
import {
  fetchPackages, fetchOffers, fetchDestinations, fetchTestimonials,
  Package, Offer, Destination, Testimonial
} from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

const REGIONS = ['Anywhere', 'India', 'UAE'];
const STYLES  = ['Cultural', 'Adventure', 'Culinary', 'Wellness', 'Family', 'Luxury'];
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [ref, cb]);
}

export default function Home() {
  const router   = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testi, setTesti] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const pkgs = await fetchPackages();
        if (pkgs && pkgs.length > 0) setPackages(pkgs);
      } catch (e) { console.error(e); }
      try {
        const offs = await fetchOffers();
        if (offs && offs.length > 0) setOffers(offs);
      } catch (e) { console.error(e); }
      try {
        const dests = await fetchDestinations();
        if (dests && dests.length > 0) setDestinations(dests);
      } catch (e) { console.error(e); }
      try {
        const testis = await fetchTestimonials();
        if (testis && testis.length > 0) setTestimonials(testis);
      } catch (e) { console.error(e); }
    }
    loadData();
  }, []);

  const featured = packages.filter(p => p.featured).slice(0, 3);
  const featuredList = featured.length > 0 ? featured : packages.slice(0, 3);
  const trendingList = packages.slice(1, 5);


  /* ── searchbar state ── */
  const [open,     setOpen]     = useState<string | null>(null);
  const [where,    setWhere]    = useState('Anywhere');
  const [style,    setStyle]    = useState('');
  const [adults,   setAdults]   = useState(2);
  const [months,   setMonths]   = useState<number[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  useClickOutside(barRef, () => setOpen(null));

  function toggleMonth(i: number) {
    setMonths(prev => prev.includes(i) ? prev.filter(m => m !== i) : [...prev, i]);
  }

  function handleFindTrips() {
    const p = new URLSearchParams();
    if (where !== 'Anywhere') p.set('region', where);
    if (style)                p.set('type', style);
    if (months.length > 0)    p.set('months', months.join(','));
    if (adults !== 2)         p.set('adults', String(adults));
    router.push('/packages' + (p.toString() ? '?' + p.toString() : ''));
  }

  const whenLabel = months.length === 0
    ? 'Any month'
    : months.length === 1
      ? MONTHS[months[0]]
      : `${months.length} months`;

  const heroImg = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2000&auto=format&fit=crop";

  return (
    <MainLayout>
      <section className="hero">
        <div className="hero-img" style={{ backgroundImage: `url(${heroImg})` }}></div>
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="line"></span> Kushmud · Spring '26 Collection</div>
          <h1>The trip you'll remember<br/>is <em>the one you almost didn't take.</em></h1>
          <p className="hero-sub">Considered itineraries across India and the UAE, planned by people who've actually slept in the haveli, taken the desert drive and walked the bazaar.</p>
          <div className="hero-meta">
            <div className="hero-meta-item">Active trips<span>1,840</span></div>
            <div className="hero-meta-item">Cities covered<span>32</span></div>
            <div className="hero-meta-item">Avg. rating<span>4.9 / 5</span></div>
            <div className="hero-meta-item">In the field<span>since 2017</span></div>
          </div>
        </div>
      </section>

      {/* ── Interactive searchbar — outside hero so overflow:hidden never clips dropdowns ── */}
      <div className="searchbar-wrap" ref={barRef}>
        <div className="searchbar">

          {/* WHERE */}
          <div
            className={'searchbar-field' + (open === 'where' ? ' sb-active' : '')}
            onClick={() => setOpen(open === 'where' ? null : 'where')}
          >
            <label>Where</label>
            <div className="val">{where}{where === 'Anywhere' && <span className="placeholder"> · pick a region</span>}</div>
            {open === 'where' && (
              <div className="sb-drop">
                {REGIONS.map(r => (
                  <div
                    key={r}
                    className={'sb-opt' + (where === r ? ' sb-opt-on' : '')}
                    onClick={e => { e.stopPropagation(); setWhere(r); setOpen(null); }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WHEN */}
          <div
            className={'searchbar-field' + (open === 'when' ? ' sb-active' : '')}
            onClick={() => setOpen(open === 'when' ? null : 'when')}
          >
            <label>When</label>
            <div className="val">{whenLabel}</div>
            {open === 'when' && (
              <div className="sb-drop sb-drop-wide" onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Select months</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {MONTHS.map((m, i) => {
                    const on = months.includes(i);
                    return (
                      <div
                        key={m}
                        onClick={() => toggleMonth(i)}
                        style={{
                          padding: '8px 0', textAlign: 'center', fontSize: 12,
                          border: '1px solid var(--line-2)', borderRadius: 2,
                          background: on ? 'var(--forest)' : 'var(--paper)',
                          color: on ? 'white' : 'var(--ink-2)',
                          cursor: 'pointer', fontFamily: 'var(--mono)',
                          transition: 'background 0.12s, color 0.12s',
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
                {months.length > 0 && (
                  <button
                    onClick={() => setMonths([])}
                    style={{ marginTop: 10, background: 'none', border: 'none', fontSize: 11, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--mono)', textDecoration: 'underline' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TRAVELERS */}
          <div
            className={'searchbar-field' + (open === 'travelers' ? ' sb-active' : '')}
            onClick={() => setOpen(open === 'travelers' ? null : 'travelers')}
          >
            <label>Travelers</label>
            <div className="val">{adults} adult{adults !== 1 ? 's' : ''}</div>
            {open === 'travelers' && (
              <div className="sb-drop" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '4px 0' }}>
                  <span style={{ fontSize: 14 }}>Adults</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => setAdults(a => Math.max(1, a - 1))}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line-2)', background: 'var(--paper)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >−</button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{adults}</span>
                    <button
                      onClick={() => setAdults(a => Math.min(12, a + 1))}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--line-2)', background: 'var(--paper)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >+</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STYLE */}
          <div
            className={'searchbar-field' + (open === 'style' ? ' sb-active' : '')}
            onClick={() => setOpen(open === 'style' ? null : 'style')}
          >
            <label>Style</label>
            <div className="val">
              {style || <span className="placeholder">Any style</span>}
            </div>
            {open === 'style' && (
              <div className="sb-drop" onClick={e => e.stopPropagation()}>
                {['', ...STYLES].map(s => (
                  <div
                    key={s || '__any'}
                    className={'sb-opt' + (style === s ? ' sb-opt-on' : '')}
                    onClick={() => { setStyle(s); setOpen(null); }}
                  >
                    {s || 'Any style'}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn btn-clay" style={{ height: 56, borderRadius: 4, padding: '0 28px', flexShrink: 0 }} onClick={handleFindTrips}>
            <Icon name="search" size={14} /> Find trips
          </button>
        </div>
      </div>



      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">— Spring's quiet picks</span>
              <h2>Three trips we'd <em style={{fontStyle:'italic'}}>genuinely</em> book ourselves</h2>
            </div>
            <div className="meta">Hand-selected by our field editors. Updated weekly with available dates and current weather notes.</div>
          </div>
          <div className="cards">
            {featuredList.map(p => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </div>
      </section>
 
      <section className="section trending">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">— Trending now</span>
              <h2>What travelers are <em style={{fontStyle:'italic'}}>booking this week</em></h2>
            </div>
            <div className="meta" style={{display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end'}}>
              <span style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--clay)'}}>● Live · updated 14 min ago</span>
              <span>Ranked by inquiries over the last 7 days.</span>
            </div>
          </div>
          <div className="trend-grid">
            {trendingList.map((p, i) => (
              <Link key={p.id} href={`/packages/${p.id}`} className="trend-card">
                <div className="trend-rank">{String(i+1).padStart(2,'0')}</div>
                <div className="trend-img" style={{ backgroundImage: `url(${p.img})` }}>
                  <span className="trend-arrow"><Icon name="arrow-up-right" size={14}/></span>
                </div>
                <div className="trend-body">
                  <div className="trend-meta">
                    <span>{p.region} · {p.type}</span>
                    <span style={{color:'var(--clay)'}}>▲ {[42,28,18,11][i]}%</span>
                  </div>
                  <h4>{p.title}</h4>
                  <div className="trend-foot">
                    <span className="trend-price"><span style={{fontFamily:'var(--sans)', fontSize:10, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginRight:6}}>From</span>${p.price.toLocaleString()}</span>
                    <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase'}}>{p.duration} days</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      <section className="offers">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color:'rgba(244,237,224,0.7)'}}>— Current offers</span>
              <h2 style={{color:'var(--paper)'}}>Three reasons to book <em style={{fontStyle:'italic', color:'var(--clay-2)'}}>this month.</em></h2>
            </div>
            <div className="meta" style={{color:'rgba(244,237,224,0.6)'}}>Limited dates. We honour any quoted price for 14 days from your first call.</div>
          </div>
          <div className="offers-grid">
            {offers.map(o => (
              <Link key={o.id} href="/packages" className="offer-card">
                <div className="offer-img" style={{ backgroundImage: `url(${o.img})` }}></div>
                <div className="offer-body">
                  <span className="offer-tag" style={{ background: o.accent }}>{o.tag}</span>
                  <h3>{o.title}</h3>
                  <p>{o.sub}</p>
                  <div className="offer-foot">
                    <span className="offer-code">CODE · <strong>{o.code}</strong></span>
                    <span className="offer-link">View trips <Icon name="arrow-right" size={13}/></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      <section className="why">
        <div className="container">
          <div style={{maxWidth:680, marginBottom:56}}>
            <span className="eyebrow">— Why Wayfare</span>
            <h2 style={{marginTop:14}}>We do the legwork. <em style={{fontStyle:'italic', color:'var(--clay)'}}>You do the wandering.</em></h2>
          </div>
          <div className="why-grid">
            <div className="why-item">
              <span className="num">01 / Curation</span>
              <h4>Walked, not listed</h4>
              <p>Every property, train and meal is one our team has used personally. No drop-shipped itineraries.</p>
            </div>
            <div className="why-item">
              <span className="num">02 / Pace</span>
              <h4>Built for slowness</h4>
              <p>Days are designed with breath in them. Two anchor activities, and time around the edges to actually be there.</p>
            </div>
            <div className="why-item">
              <span className="num">03 / Trust</span>
              <h4>One person, one number</h4>
              <p>You get a named planner. They answer the phone — at home and from the road. ATOL-protected on every booking.</p>
            </div>
            <div className="why-item">
              <span className="num">04 / Footprint</span>
              <h4>Quiet impact</h4>
              <p>Local operators, fair-rate guides, carbon offset built into pricing. Not a marketing badge, an accounting line.</p>
            </div>
          </div>
        </div>
      </section>
 
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">— Where we go</span>
              <h2>Two countries. <em style={{fontStyle:'italic'}}>Known intimately.</em></h2>
            </div>
            <div className="meta">India and the UAE — two regions, hundreds of routes. We'd rather know two places deeply than fifty lightly.</div>
          </div>
          <div className="dest-grid">
            {destinations.map((d, i) => (
              <Link
                key={i}
                href={`/packages?region=${encodeURIComponent(d.name.split(' ')[0] === 'Rajasthan' || d.name === 'Kerala' || d.name === 'Ladakh' ? 'India' : d.name === 'Dubai' || d.name === 'Abu Dhabi' ? 'UAE' : 'India')}`}
                className={'dest-card ' + (d.size || '')}
                style={{ backgroundImage: `url(${d.img})`, gridRow: d.size === 'lg' ? 'span 2' : undefined }}
              >
                <div className="dest-content">
                  <span className="eyebrow" style={{color:'rgba(255,255,255,0.85)'}}>{d.tag}</span>
                  <h3>{d.name}</h3>
                  <div className="count">{d.count} curated trips</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      <section className="testi">
        <div className="container">
          <span className="eyebrow">— Travelers</span>
          <div style={{marginTop:36}}>
            <p className="testi-quote">
              <span className="open">"</span>{(testimonials[testi] || testimonials[0] || { quote: '', avatar: '', name: '', place: '' }).quote}
            </p>
            <div className="testi-attrib">
              <div className="testi-avatar" style={{ backgroundImage: `url(${(testimonials[testi] || testimonials[0] || { quote: '', avatar: '', name: '', place: '' }).avatar})`}}></div>
              <div>
                <div className="testi-name">{(testimonials[testi] || testimonials[0] || { quote: '', avatar: '', name: '', place: '' }).name}</div>
                <div className="testi-place">{(testimonials[testi] || testimonials[0] || { quote: '', avatar: '', name: '', place: '' }).place}</div>
              </div>
            </div>
            <div className="testi-nav">
              {testimonials.map((_, i) =>
                <button key={i} className={'testi-dot ' + (i === testi ? 'active' : '')} onClick={() => setTesti(i)}></button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="news">
        <div className="container">
          <div className="news-inner">
            <div>
              <span className="eyebrow" style={{color:'rgba(244,237,224,0.6)'}}>— Field Journal</span>
              <h2 style={{marginTop:14}}>A letter from somewhere<br/><em>worth being.</em></h2>
              <p>Once a month. Notes from our planners on the road, and one trip we think you'd like that hasn't filled yet.</p>
            </div>
            <div>
              <form className="news-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="your.address@email.com"/>
                <button type="submit">Subscribe <Icon name="arrow-right" size={14}/></button>
              </form>
              <p style={{marginTop:14, fontSize:12, opacity:0.55}}>No spam. Unsubscribe at the bottom of any letter.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
