'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchDestinations, fetchRegions, Destination, Region } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Repeating tile-size pattern for the bento/Pinterest-style grid — cycles regardless
// of how many destinations there are, so it never depends on a fixed item count.
const BENTO_PATTERN: { colSpan: number; rowSpan: number }[] = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    fetchDestinations().then(setDestinations).catch(console.error);
    fetchRegions().then(setRegions).catch(console.error);
  }, []);

  const groups = useMemo(() => {
    const byRegion = new Map<string, Destination[]>();
    for (const d of destinations) {
      const list = byRegion.get(d.region) ?? [];
      list.push(d);
      byRegion.set(d.region, list);
    }
    const orderedNames = regions.length > 0 ? regions.map(r => r.name) : Array.from(byRegion.keys()).sort();
    return orderedNames
      .filter(name => byRegion.has(name))
      .map(name => ({ name, destinations: byRegion.get(name)! }));
  }, [destinations, regions]);

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Destinations</span></div>
          <h1>Where we go, <em style={{fontStyle:'italic'}}>intimately.</em></h1>
          <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>We cover the globe, deeply — ensuring every hotel, route, and guide is one we know by name.</p>
        </div>
      </div>

      <div className="container page-content-sm">

        {/* ── Bento / Pinterest-style showcase of every destination ── */}
        <div className="bento-grid" style={{ marginBottom: 80 }}>
          {destinations.map((d, i) => {
            const { colSpan, rowSpan } = BENTO_PATTERN[i % BENTO_PATTERN.length];
            return (
              <Link
                key={d.name}
                href={`/packages?region=${encodeURIComponent(d.region)}`}
                className="dest-card"
                style={{
                  backgroundImage: `url(${d.img})`,
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                }}
              >
                <div className="dest-content">
                  <span className="eyebrow" style={{color:'rgba(255,255,255,0.85)'}}>{d.tag}</span>
                  <h3>{d.name}</h3>
                  <div className="count">{d.count} curated trips</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Regions we cover ── */}
        {regions.length > 0 && (
          <div style={{marginBottom: 56}}>
            <span className="eyebrow">— Where we operate</span>
            <div className="region-pills-row" style={{marginTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10}}>
              <span style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)'}}>
                {regions.length} region{regions.length !== 1 ? 's' : ''} we cover
              </span>
              <div className="region-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {regions.map(r => (
                  <a
                    key={r.name}
                    href={`#region-${slugify(r.name)}`}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13,
                      border: '1px solid var(--line-2)', color: 'var(--ink)',
                      textDecoration: 'none', background: 'var(--paper)',
                    }}
                  >
                    {r.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── All destinations, grouped by region ── */}
        {groups.map(g => (
          <div key={g.name} id={`region-${slugify(g.name)}`} style={{marginBottom: 72, scrollMarginTop: 96}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24}}>
              <h2 style={{fontSize: 32}}>{g.name}</h2>
              <span style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)'}}>
                {g.destinations.length} destination{g.destinations.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16}}>
              {g.destinations.map(d => (
                <Link
                  key={d.name}
                  href={`/packages?region=${encodeURIComponent(d.region)}`}
                  className="dest-card"
                  style={{ backgroundImage: `url(${d.img})`, height: 260 }}
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
        ))}

        <div className="rgrid" style={{marginTop: 96, '--gap': '64px'} as React.CSSProperties}>
          <div>
            <span className="eyebrow">— The Kushmud approach</span>
            <h2 style={{marginTop: 16, fontSize: 36}}>Regional expertise, <em style={{fontStyle:'italic'}}>wherever we go.</em></h2>
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
                <span>In-house ground teams across every region we serve</span>
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
