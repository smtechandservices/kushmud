'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';


const points = [
  { icon: 'map', label: 'Destinations', value: '18+' },
  { icon: 'users', label: 'Trips completed', value: '4,000+' },
  { icon: 'star', label: 'Avg. rating', value: '4.9 / 5' },
  { icon: 'clock', label: 'Years on the road', value: '8+' },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Our Story</span></div>
          <h1>The trip you'll remember<br/><em style={{fontStyle:'italic'}}>is the one we lived first.</em></h1>
        </div>
      </div>

      {/* ── Origin story ── */}
      <div className="container page-content">
        <div className="rgrid" style={{'--gap': '80px', alignItems: 'center'} as React.CSSProperties}>
          <div>
            <p style={{fontSize: 24, lineHeight: 1.4, fontFamily: 'var(--serif)', color: 'var(--ink)'}}>
              Kushmud was founded in 2017 with a simple, slightly stubborn belief: that travel is better when it's slow, and even better when it's certain.
            </p>
            <p style={{marginTop: 32, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)'}}>
              We started with a single route through Rajasthan. No fancy office, just two planners and a battered Jeep. We didn't want to be the biggest agency; we wanted to be the one that knew exactly which window in Udaipur had the best view of the lake at dawn.
            </p>
            <p style={{marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)'}}>
              Today, we serve destinations globally with that same level of granular detail. Every partner property is visited annually. Every driver is a friend. Every meal we recommend is one we've enjoyed ourselves.
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, marginTop: 20, paddingTop: 32}}>
              {points.map((p) => (
                <div key={p.label} style={{padding: '20px 0px'}}>
                  <div style={{fontFamily: 'var(--serif)', fontSize: 32, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--forest)'}}>
                    {p.value}
                  </div>
                  <div style={{fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6}}>
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position: 'relative'}}>
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop"
              alt="Our story"
              style={{width: '100%', borderRadius: 4, display: 'block', maxHeight: 600, objectFit: 'cover'}}
            />
            <div className="about-badge-card" style={{position: 'absolute', bottom: -40, right: -40, width: 240, padding: 24, background: 'var(--clay)', color: 'white', borderRadius: 4, boxShadow: 'var(--shadow-lg)'}}>
              <div style={{fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12}}>Est. 2017</div>
              <div style={{fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.2}}>From a single Jeep to a regional network.</div>
            </div>
          </div>
        </div>
      </div>



{/* ── Values ── */}
      <div style={{background: 'var(--sand)', borderTop: '1px solid var(--line)', padding: '96px 0'}}>
        <div className="container">
          <span className="eyebrow">— Our Values</span>
          <div className="rgrid" style={{'--cols': 'repeat(3, 1fr)', '--gap': '48px', marginTop: 40} as React.CSSProperties}>
            <div>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
                <Icon name="leaf" size={20} style={{color: 'var(--forest)'}}/>
              </div>
              <h4>Quiet impact</h4>
              <p style={{marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>We prioritize local operators and fair-rate guides. Sustainability isn't a badge; it's how we balance our books.</p>
            </div>
            <div>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
                <Icon name="clock" size={20} style={{color: 'var(--forest)'}}/>
              </div>
              <h4>Considered pace</h4>
              <p style={{marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>We build breath into every itinerary. Two anchor activities a day, leaving room for the unexpected.</p>
            </div>
            <div>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
                <Icon name="shield" size={20} style={{color: 'var(--forest)'}}/>
              </div>
              <h4>Total transparency</h4>
              <p style={{marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>No hidden fees or markups. We're ATOL protected and always available while you're on the road.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{background: 'var(--forest)', padding: '80px 0'}}>
        <div className="container" style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'rgba(244,237,224,0.6)'}}>— Ready when you are</span>
          <h2 style={{color: 'var(--paper)', marginTop: 16, marginBottom: 10}}>Your next journey<br/><em style={{fontStyle:'italic'}}>starts with one question.</em></h2>
          <p style={{color: 'rgba(244,237,224,0.72)', fontSize: 16, marginTop: 20, marginBottom: 40}}>Tell us where you want to go. We'll handle everything from there.</p>
          <a href="/packages" className="btn btn-primary" style={{background: 'var(--sand)', color: 'var(--forest)', borderColor: 'var(--sand)', fontSize: 15, padding: '16px 36px'}}>
            Browse packages
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
