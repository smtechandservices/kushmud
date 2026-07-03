'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchDestinations, Destination } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinations().then(setDestinations).catch(console.error);
  }, []);

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Destinations</span></div>
          <h1 style={{fontSize:64}}>Where we go, <em style={{fontStyle:'italic'}}>intimately.</em></h1>
          <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>We don't try to cover the globe. We cover two regions deeply, ensuring every hotel, route, and guide is one we know by name.</p>
        </div>
      </div>

      <div className="container" style={{padding: '64px 40px 96px'}}>
        <div className="dest-grid">
          {destinations.map((d, i) => (
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

        <div style={{marginTop: 96, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64}}>
          <div>
            <span className="eyebrow">— The Kushmud approach</span>
            <h2 style={{marginTop: 16, fontSize: 36}}>Regional expertise <em style={{fontStyle:'italic'}}>over</em> global reach.</h2>
            <p style={{marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)'}}>
              Our planners spend three months of every year in the field. They aren't booking from a catalog; they're booking from their own notebooks. When we say a haveli is quiet at night, it's because we've slept there.
            </p>
            <div style={{marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16}}>
              <div style={{display: 'flex', gap: 12}}>
                <Icon name="check" size={16} stroke={2.5} style={{color: 'var(--clay)'}}/>
                <span>Direct relationships with heritage properties</span>
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <Icon name="check" size={16} stroke={2.5} style={{color: 'var(--clay)'}}/>
                <span>Private drivers with 10+ years experience</span>
              </div>
              <div style={{display: 'flex', gap: 12}}>
                <Icon name="check" size={16} stroke={2.5} style={{color: 'var(--clay)'}}/>
                <span>In-house ground team in Delhi and Dubai</span>
              </div>
            </div>
          </div>
          <div style={{backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 4, minHeight: 400}}>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
