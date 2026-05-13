'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES, OFFERS, DESTINATIONS, TESTIMONIALS } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

export default function Home() {
  const featured = PACKAGES.slice(0, 3);
  const trending = PACKAGES.slice(1, 5);
  const [testi, setTesti] = useState(0);

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
        <div className="searchbar">
          <div className="searchbar-field">
            <label>Where</label>
            <div className="val">Anywhere<span className="placeholder"> · pick a region</span></div>
          </div>
          <div className="searchbar-field">
            <label>When</label>
            <div className="val">Apr 14 — Apr 28</div>
          </div>
          <div className="searchbar-field">
            <label>Travelers</label>
            <div className="val">2 adults</div>
          </div>
          <div className="searchbar-field">
            <label>Style</label>
            <div className="val">Cultural · Slow</div>
          </div>
          <Link href="/packages" className="btn btn-clay" style={{height: 56, borderRadius: 4, padding: '0 28px'}}>
            <Icon name="search" size={14}/> Find trips
          </Link>
        </div>
      </section>

      <div className="spacer"></div>

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
            {featured.map(p => <PackageCard key={p.id} pkg={p} />)}
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
            {trending.map((p, i) => (
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
            {OFFERS.map(o => (
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
            {DESTINATIONS.map((d, i) => (
              <Link key={i} href="/packages" className={'dest-card ' + (d.size || '')}
                   style={{ backgroundImage: `url(${d.img})`, gridRow: d.size === 'lg' ? 'span 2' : undefined }}>
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
              <span className="open">"</span>{TESTIMONIALS[testi].quote}
            </p>
            <div className="testi-attrib">
              <div className="testi-avatar" style={{ backgroundImage: `url(${TESTIMONIALS[testi].avatar})`}}></div>
              <div>
                <div className="testi-name">{TESTIMONIALS[testi].name}</div>
                <div className="testi-place">{TESTIMONIALS[testi].place}</div>
              </div>
            </div>
            <div className="testi-nav">
              {TESTIMONIALS.map((_, i) =>
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
