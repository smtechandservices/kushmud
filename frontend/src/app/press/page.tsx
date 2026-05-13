'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function PressPage() {
  const PRESS = [
    { outlet: "Conde Nast Traveler", title: "The New Slow: Why Kushmud is the only way to see Rajasthan", date: "Jan 2026" },
    { outlet: "Financial Times", title: "The planners who actually live the trip first", date: "Nov 2025" },
    { outlet: "Monocle", title: "Travel: The considered itineraries of Kushmud", date: "Sept 2025" },
  ];

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Press</span></div>
          <h1 style={{fontSize:64}}>In the news,<br/><em style={{fontStyle:'italic'}}>and on the ground.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{maxWidth: 800}}>
          <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 40, paddingBottom: 16, borderBottom: '1px solid var(--line)'}}>Recent Coverage</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 48}}>
            {PRESS.map((p, i) => (
              <div key={i}>
                <span className="eyebrow" style={{color: 'var(--clay)'}}>{p.outlet} · {p.date}</span>
                <h3 style={{fontSize: 28, marginTop: 12, lineHeight: 1.2}}>{p.title}</h3>
                <button className="btn btn-link" style={{marginTop: 16}}>Read the article</button>
              </div>
            ))}
          </div>

          <div style={{marginTop: 120, padding: '48px', background: 'var(--sand)', borderRadius: 4}}>
            <h4 style={{fontSize: 20, marginBottom: 16}}>Media Inquiries</h4>
            <p style={{fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 32}}>
              For press releases, high-resolution imagery, or to interview one of our field editors, please get in touch with our communications team.
            </p>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <Icon name="mail" size={16} style={{color: 'var(--clay)'}}/>
              <span style={{fontSize: 16, fontWeight: 500}}>press@kushmud.com</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
