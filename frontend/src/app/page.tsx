'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PackageCard } from '@/components/PackageCard';
import {
  fetchPackages, fetchOffers, fetchDestinations, fetchTestimonials, fetchSiteStats, fetchFlyers,
  subscribeToNewsletter, isCustomerLoggedIn, fetchNewsletterStatus,
  Package, Offer, Destination, Testimonial, SiteStats, Flyer
} from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

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
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [destOrder, setDestOrder] = useState<number[]>([]);
  const [destSwapPos, setDestSwapPos] = useState<number | null>(null);
  const destSwapCursor = useRef(0);

  const REGIONS = useMemo(
    () => ['Anywhere', ...Array.from(new Set(packages.map(p => p.region))).sort()],
    [packages]
  );

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
      try {
        const stats = await fetchSiteStats();
        setSiteStats(stats);
      } catch (e) { console.error(e); }
      try {
        const fly = await fetchFlyers();
        if (fly && fly.length > 0) setFlyers(fly);
      } catch (e) { console.error(e); }
    }
    loadData();

    if (isCustomerLoggedIn()) {
      fetchNewsletterStatus()
        .then(status => setIsNewsletterSubscribed(status.subscribed))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setDestOrder(destinations.map((_, i) => i));
    destSwapCursor.current = 0;
  }, [destinations]);

  useEffect(() => {
    if (destOrder.length < 2) return;
    const DEST_SWAP_INTERVAL = 5000;
    const DEST_FADE_MS = 450;
    const interval = setInterval(() => {
      const pos = 1 + (destSwapCursor.current % (destOrder.length - 1));
      destSwapCursor.current += 1;
      setDestSwapPos(pos);
      setTimeout(() => {
        setDestOrder(prev => {
          const next = [...prev];
          [next[0], next[pos]] = [next[pos], next[0]];
          return next;
        });
        setDestSwapPos(null);
      }, DEST_FADE_MS);
    }, DEST_SWAP_INTERVAL);
    return () => clearInterval(interval);
  }, [destOrder.length]);

  const featured = packages.filter(p => p.featured).slice(0, 3);
  const featuredList = featured.length > 0 ? featured : packages.slice(0, 3);
  const trendingList = siteStats?.trending ?? [];
  const FLYER_LOOP_MIN = 8;
  const flyerLoop = flyers.length > 0
    ? Array.from({ length: Math.ceil(FLYER_LOOP_MIN / flyers.length) }, () => flyers).flat()
    : [];


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

  /* ── newsletter form state ── */
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('loading');
    setNewsletterMessage('');
    try {
      await subscribeToNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage("Thanks — you're subscribed.");
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
      setNewsletterStatus('error');
      setNewsletterMessage('Something went wrong, please try again.');
    }
  }

  // const heroImg = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=2000&auto=format&fit=crop";
  const heroVideos = [
    "https://media.gettyimages.com/id/1280006497/video/t-l-aerial-view-of-dubai-skyline-at-sunrise-dubai-uae.mp4?s=mp4-640x640-gi&k=20&c=mkoDVR6EN9kKijsto5hTOp5Yx1Y6kIpucaEHYT3J9gc=",
    "https://media.gettyimages.com/id/140813852/video/panoramic-view-of-chemrey-monastery-on-the-mountains.mp4?s=mp4-640x640-gi&k=20&c=-3Wyu_Ym0SWSgQLJngCnodNBrWag2W8U9geIQ5OyLnA=",
    "https://media.gettyimages.com/id/103256040/video/side-houseboat-sailing-on-kerala-backwaters-cochin-kerala-india.mp4?s=mp4-640x640-gi&k=20&c=tNp68UTFuPlO6O0ZE2zHQzSwUD9ga6B-dRoQm9j55KM="
  ];
  const HERO_FADE_MS = 1200;
  const HERO_MAX_PLAY_S = 8;
  const [activeHeroSlot, setActiveHeroSlot] = useState<0 | 1>(0);
  const [heroSlotSrc, setHeroSlotSrc] = useState<[string, string]>([
    heroVideos[0],
    heroVideos[1 % heroVideos.length],
  ]);
  const heroVideoRefA = useRef<HTMLVideoElement>(null);
  const heroVideoRefB = useRef<HTMLVideoElement>(null);
  const heroSlotRefs = [heroVideoRefA, heroVideoRefB];
  const nextHeroVideoCursor = useRef(2 % heroVideos.length);

  useEffect(() => {
    heroSlotRefs[activeHeroSlot].current?.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHeroTimeUpdate(slot: 0 | 1) {
    if (heroVideos.length < 2 || slot !== activeHeroSlot) return;
    const video = heroSlotRefs[slot].current;
    if (!video) return;
    const fadeLeadS = HERO_FADE_MS / 1000;
    const hitMaxPlay = video.currentTime >= HERO_MAX_PLAY_S - fadeLeadS;
    const nearNaturalEnd = video.duration ? video.duration - video.currentTime <= fadeLeadS : false;
    if (hitMaxPlay || nearNaturalEnd) {
      const inactive = slot === 0 ? 1 : 0;
      heroSlotRefs[inactive].current?.play().catch(() => {});
      setActiveHeroSlot(inactive);
    }
  }

  function handleHeroTransitionEnd(slot: 0 | 1) {
    if (heroVideos.length < 2 || slot === activeHeroSlot) return;
    const video = heroSlotRefs[slot].current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    const nextIndex = nextHeroVideoCursor.current;
    nextHeroVideoCursor.current = (nextIndex + 1) % heroVideos.length;
    setHeroSlotSrc(prev => {
      const next = [...prev] as [string, string];
      next[slot] = heroVideos[nextIndex];
      return next;
    });
  }

  return (
    <MainLayout>
      <section className="hero">
        <video
          ref={heroVideoRefA}
          className="hero-video"
          src={heroSlotSrc[0]}
          muted
          playsInline
          preload="auto"
          loop={heroVideos.length < 2}
          style={{ opacity: activeHeroSlot === 0 ? 1 : 0, transition: `opacity ${HERO_FADE_MS}ms ease` }}
          onTimeUpdate={() => handleHeroTimeUpdate(0)}
          onTransitionEnd={() => handleHeroTransitionEnd(0)}
        />
        {heroVideos.length > 1 && (
          <video
            ref={heroVideoRefB}
            className="hero-video"
            src={heroSlotSrc[1]}
            muted
            playsInline
            preload="auto"
            style={{ opacity: activeHeroSlot === 1 ? 1 : 0, transition: `opacity ${HERO_FADE_MS}ms ease` }}
            onTimeUpdate={() => handleHeroTimeUpdate(1)}
            onTransitionEnd={() => handleHeroTransitionEnd(1)}
          />
        )}
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="line"></span> Kushmud · Spring '26 Collection</div>
          <h1>The trip you'll remember<br/>is <em>the one you almost didn't take.</em></h1>
          <p className="hero-sub">Considered itineraries served globally, planned by people who've actually slept in the haveli, taken the desert drive and walked the bazaar.</p>
          <div className="hero-meta">
            <div className="hero-meta-item">Active trips<span>{siteStats ? siteStats.active_trips.toLocaleString() : '—'}</span></div>
            <div className="hero-meta-item">Cities covered<span>{siteStats ? siteStats.cities_covered : '—'}</span></div>
            <div className="hero-meta-item">Regions<span>{siteStats ? siteStats.regions_covered : '—'}</span></div>
            <div className="hero-meta-item">Avg. rating<span>{siteStats ? `${siteStats.avg_rating} / 5` : '—'}</span></div>
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
 
      {trendingList.length > 0 && (
        <section className="section trending">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">— Trending now</span>
                <h2>
                  {siteStats?.trending_basis === 'inquiries'
                    ? <>What travelers are <em style={{fontStyle:'italic'}}>booking this week</em></>
                    : <>Our <em style={{fontStyle:'italic'}}>highest-rated trips</em></>}
                </h2>
              </div>
              <div className="meta" style={{display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end'}}>
                <span>
                  {siteStats?.trending_basis === 'inquiries'
                    ? 'Ranked by inquiries over the last 7 days.'
                    : 'Handpicked favorites, ranked by traveler rating.'}
                </span>
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
                    </div>
                    <h4>{p.title}</h4>
                    <div className="trend-foot">
                      <span className="trend-price"><span style={{fontFamily:'var(--sans)', fontSize:10, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginRight:6}}>From</span>₹{p.price.toLocaleString()}</span>
                      <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase'}}>{p.duration} days</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {flyers.length > 0 && (
        <section className="section flyers">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">— Flyers</span>
                <h2>Fresh <em style={{fontStyle:'italic'}}>deals & drops</em></h2>
              </div>
            </div>
          </div>
          <div className="flyers-marquee">
            <div
              className="flyers-track"
              style={{ animationDuration: `${flyerLoop.length * 4}s` }}
            >
              {[...flyerLoop, ...flyerLoop].map((f, i) => (
                <div key={`${f.id}-${i}`} className="flyer-card">
                  <div className="flyer-img" style={{ backgroundImage: `url(${f.img})` }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="offers">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color:'rgba(244,237,224,0.7)'}}>— Current offers</span>
              <h2 style={{color:'var(--paper)'}}>Reasons to book <em style={{fontStyle:'italic', color:'var(--clay-2)'}}>this month.</em></h2>
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
              <h2>Everywhere. <em style={{fontStyle:'italic'}}>Known intimately.</em></h2>
            </div>
            <div className="meta">Served globally, hundreds of routes vetted by planners who've actually stood in the places they recommend.</div>
          </div>
          <div className="dest-grid">
            {destOrder.slice(0, 5).map((destIdx, pos) => {
              const d = destinations[destIdx];
              const isLg = pos === 0;
              const isSwapping = destSwapPos !== null && (pos === 0 || pos === destSwapPos);
              return (
                <Link
                  key={pos}
                  href={`/packages?region=${encodeURIComponent(d.region)}`}
                  className={'dest-card ' + (isLg ? 'lg' : '') + (isSwapping ? ' dest-swap' : '')}
                  style={{ backgroundImage: `url(${d.img})`, gridRow: isLg ? 'span 2' : undefined }}
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
        </div>
      </section>
 
      {testimonials.length > 0 && (
        <section className="testi">
          <div className="container">
            <span className="eyebrow">— Travelers</span>
            <div style={{marginTop:36}}>
              <p className="testi-quote">
                <span className="open">"</span>{testimonials[testi].quote}
              </p>
              <div className="testi-attrib">
                <div className="testi-avatar" style={{ backgroundImage: `url(${testimonials[testi].avatar})`}}></div>
                <div>
                  <div className="testi-name">{testimonials[testi].name}</div>
                  <div className="testi-place">{testimonials[testi].place}</div>
                </div>
              </div>
              <div className="testi-nav">
                <div className="testi-dots">
                  {testimonials.map((_, i) =>
                    <button key={i} className={'testi-dot ' + (i === testi ? 'active' : '')} onClick={() => setTesti(i)}></button>
                  )}
                </div>
                &nbsp;
                <button
                  style={{marginLeft: 8}}
                  className="testi-next"
                  onClick={() => setTesti((testi + 1) % testimonials.length)}
                >
                  <Icon name="arrow-right" size={13}/>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="news">
        <div className="container">
          <div className="news-inner">
            <div>
              <span className="eyebrow" style={{color:'rgba(244,237,224,0.6)'}}>— Field Journal</span>
              <h2 style={{marginTop:14}}>A letter from somewhere<br/><em>worth being.</em></h2>
              <p>Once a month. Notes from our planners on the road, and one trip we think you'd like that hasn't filled yet.</p>
            </div>
            <div>
              {isNewsletterSubscribed ? (
                <p style={{fontSize:14}}>
                  You are already a subscriber.<br/>
                  Want to unsubscribe? Go to your <Link href="/profile" style={{textDecoration:'underline'}}>profile</Link>.
                </p>
              ) : (
                <>
                  <form className="news-form" onSubmit={handleNewsletterSubmit}>
                    <input
                      type="email"
                      placeholder="your.address@email.com"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      required
                      disabled={newsletterStatus === 'loading'}
                    />
                    <button type="submit" disabled={newsletterStatus === 'loading'}>
                      {newsletterStatus === 'loading' ? 'Subscribing…' : 'Subscribe'} <Icon name="arrow-right" size={14}/>
                    </button>
                  </form>
                  {newsletterMessage && (
                    <p style={{marginTop:14, fontSize:12, opacity:0.85}}>{newsletterMessage}</p>
                  )}
                  <p style={{marginTop:14, fontSize:12, opacity:0.55}}>No spam. Unsubscribe at the bottom of any letter.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
