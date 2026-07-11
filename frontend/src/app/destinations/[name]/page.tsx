'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchDestinations, Destination } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function DestinationDetailPage() {
  const { name } = useParams();
  const destinationName = typeof name === 'string' ? name : Array.isArray(name) ? name[0] : '';
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!destinationName) return;
    setLoading(true);
    setNotFound(false);
    fetchDestinations()
      .then(list => {
        const match = list.find(d => d.name === destinationName);
        if (match) {
          setDestination(match);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [destinationName]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </MainLayout>
    );
  }

  if (notFound || !destination) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontFamily: 'var(--serif)', marginBottom: 12 }}>We couldn't find that destination.</p>
          <Link href="/destinations" className="btn btn-ghost">Browse all destinations</Link>
        </div>
      </MainLayout>
    );
  }

  const locations = destination.locations ?? [];

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <Link href="/destinations">Destinations</Link> / <span>{destination.name}</span></div>
          <h1>{destination.name}</h1>
          <p style={{color:'var(--muted)', marginTop:14, fontFamily:'var(--mono)', fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase'}}>
            {destination.region} · {destination.tag}
          </p>
        </div>
      </div>

      <div className="container page-content-sm">
        <div
          style={{
            backgroundImage: `url(${destination.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 4,
            height: 360,
            marginBottom: 56,
          }}
        />

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 24}}>
          <div>
            <span className="eyebrow">— Things to do</span>
            <h2 style={{marginTop: 10, fontSize: 32}}>Make the most of {destination.name}</h2>
          </div>
          <Link href={`/packages?region=${encodeURIComponent(destination.region)}`} className="btn btn-primary btn-sm">
            Browse trips
          </Link>
        </div>

        {locations.length === 0 ? (
          <div className="panel" style={{padding: 48, textAlign: 'center', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: 4}}>
            <Icon name="pin" size={28} style={{marginBottom: 14, color: 'var(--clay)'}} />
            <p>We're still curating our guide to {destination.name}. Check back soon.</p>
          </div>
        ) : (
          <div className="cards" style={{marginBottom: 80}}>
            {locations.map(loc => (
              <div key={loc.id} className="card" style={{cursor:'default'}}>
                <div
                  className="card-img wide"
                  style={loc.img ? { backgroundImage: `url(${loc.img})` } : undefined}
                />
                <div>
                  <h3>{loc.name}</h3>
                  {loc.description && <p style={{color:'var(--ink-2)', fontSize:14.5, lineHeight:1.6}}>{loc.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
