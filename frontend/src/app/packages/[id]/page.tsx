'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { fetchPackageById, fetchPackageReviews, Package, PackageReview } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { useCurrency } from '@/context/CurrencyContext';

export default function DetailPage() {
  const { id } = useParams();
  const packageId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { formatPrice } = useCurrency();
  const [reviews, setReviews] = useState<PackageReview[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!packageId) return;
    setLoading(true);
    setNotFound(false);
    async function load() {
      try {
        const data = await fetchPackageById(packageId);
        setPkg(data);
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [packageId]);

  useEffect(() => {
    if (!packageId) return;
    fetchPackageReviews(packageId).then(setReviews).catch(console.error);
  }, [packageId]);

  const images = pkg?.gallery && pkg.gallery.length > 0 ? pkg.gallery : pkg ? [pkg.img] : [];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => i === null ? null : (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i === null ? null : (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, images.length]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </MainLayout>
    );
  }

  if (notFound || !pkg) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontFamily: 'var(--serif)', marginBottom: 12 }}>We couldn't find that trip.</p>
          <Link href="/packages" className="btn btn-ghost">Browse all trips</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container" style={{paddingTop:32}}>
        <div className="crumbs" style={{marginBottom:20}}>Kushmud / {pkg.region} / <span>{pkg.title}</span></div>
        <div className="gallery">
          <div className="lg" style={{ backgroundImage: `url(${pkg.gallery?.[0] || pkg.img})`, cursor:'pointer' }} onClick={() => setLightboxIndex(Math.min(0, images.length - 1))}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[1] || pkg.img})`, cursor:'pointer' }} onClick={() => setLightboxIndex(Math.min(1, images.length - 1))}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[2] || pkg.img})`, cursor:'pointer' }} onClick={() => setLightboxIndex(Math.min(2, images.length - 1))}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[3] || pkg.img})`, cursor:'pointer' }} onClick={() => setLightboxIndex(Math.min(3, images.length - 1))}></div>
          <div style={{ backgroundImage: `url(${pkg.gallery?.[4] || pkg.img})`, position:'relative', cursor:'pointer' }} onClick={() => setLightboxIndex(Math.min(4, images.length - 1))}>
            {pkg.gallery && pkg.gallery.length > 5 && (
              <div style={{position:'absolute', inset:0, background:'rgba(28,25,22,0.55)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase'}}>
                + {pkg.gallery.length - 5} Photos
              </div>
            )}
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
              <span>Curated by <strong style={{color:'var(--ink)'}}>our {pkg.region}</strong> specialists</span>
            </div>

            <div className="detail-meta">
              <div className="item"><span className="lbl">Duration</span><span className="v">{pkg.duration} days</span></div>
              {pkg.group_size && <div className="item"><span className="lbl">Group size</span><span className="v">{pkg.group_size}</span></div>}
              {pkg.best_months && <div className="item"><span className="lbl">Best months</span><span className="v">{pkg.best_months}</span></div>}
              <div className="item"><span className="lbl">Style</span><span className="v">{pkg.type}</span></div>
            </div>

            <div className="detail-section">
              <h3>Day by day</h3>
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div className="itin">
                  {pkg.itinerary.map((d, i) => (
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
              ) : (
                <p style={{ color: 'var(--muted)' }}>Detailed day-by-day itinerary coming soon for this trip.</p>
              )}
            </div>

            <div className="detail-section">
              <h3>What's included</h3>
              <div className="incl">
                {pkg.highlights.map(x => (
                  <div key={x} className="incl-row"><Icon name="check" size={11} stroke={2.5} className="ic"/><span>{x}</span></div>
                ))}
                {[
                  'International flights', 'Travel insurance', 'Personal expenses',
                ].map(x => (
                  <div key={x} className="incl-row no"><Icon name="x" size={11} stroke={2} className="ic"/><span>{x}</span></div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Reviews</h3>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>No reviews yet for this trip.</p>
              ) : (
                <div className="rgrid" style={{'--gap': '32px'} as React.CSSProperties}>
                  {reviews.slice(0, 4).map(r => (
                    <div key={r.id} style={{padding:'4px 0'}}>
                      <div style={{display:'flex', gap:4, color:'var(--clay)', marginBottom:10}}>
                        {Array.from({ length: Math.round(r.rating) }).map((_, s) => <Icon key={s} name="star" size={12} stroke={0}/>)}
                      </div>
                      <p style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.4, color:'var(--ink)'}}>
                        "{r.quote}"
                      </p>
                      <div style={{marginTop:14, fontSize:13, color:'var(--muted)', fontFamily:'var(--mono)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
                        — {r.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside style={{ position: 'sticky', top: 100, alignSelf: 'start', height: 'fit-content' }}>
            <div className="book-card">
              <div className="price-row">
                <div>
                  <div className="price">{formatPrice(pkg.price)}</div>
                  <div className="per">per person, double occupancy</div>
                  {pkg.priceWas && <div className="strike">{formatPrice(pkg.priceWas)}</div>}
                </div>
                {pkg.priceWas && <span className="save">Save {formatPrice(pkg.priceWas-pkg.price)}</span>}
              </div>
              <div style={{marginTop:18, marginBottom:8, fontSize:13, color:'var(--muted)'}}>
                Choose your dates and party size when you enquire.
              </div>
              <Link href={`/checkout?pkg=${pkg.id}`} className="btn btn-clay" style={{width: '100%', marginTop: 6, padding: 16, fontSize: 15}}>
                Enquire now <Icon name="arrow-right" size={14}/>
              </Link>
              <Link href="/contact" className="btn btn-ghost" style={{width:'100%', marginTop:8, textAlign:'center'}}>Talk to a planner first</Link>
              <div className="trust">
                <Icon name="shield" size={11}/> Fully bonded · No charge until you confirm
              </div>
            </div>
          </aside>
        </div>
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position:'fixed', inset:0, zIndex:2000, background:'rgba(12,10,8,0.94)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:40,
          }}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            style={{
              position:'absolute', top:24, right:32, width:40, height:40, borderRadius:'50%',
              background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
              color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            }}
          >
            <Icon name="x" size={16} />
          </button>

          <div style={{position:'absolute', top:28, left:40, color:'white', fontFamily:'var(--mono)', fontSize:12, letterSpacing:'0.08em'}}>
            {lightboxIndex + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i === null ? null : (i - 1 + images.length) % images.length); }}
              aria-label="Previous image"
              style={{
                position:'absolute', left:24, top:'50%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%',
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
                color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}
            >
              <Icon name="arrow-right" size={16} style={{transform:'rotate(180deg)'}} />
            </button>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`${pkg.title} — photo ${lightboxIndex + 1}`}
            onClick={e => e.stopPropagation()}
            style={{maxWidth:'88vw', maxHeight:'85vh', objectFit:'contain', borderRadius:4}}
          />

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => i === null ? null : (i + 1) % images.length); }}
              aria-label="Next image"
              style={{
                position:'absolute', right:24, top:'50%', transform:'translateY(-50%)', width:44, height:44, borderRadius:'50%',
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
                color:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}
            >
              <Icon name="arrow-right" size={16} />
            </button>
          )}
        </div>
      )}
    </MainLayout>
  );
}
