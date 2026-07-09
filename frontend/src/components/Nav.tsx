'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from './Icon';
import {
  isCustomerLoggedIn, fetchCustomerMe, customerLogout, Customer,
  fetchRegions, fetchDestinations, fetchStories, Region, Destination, Story,
} from '@/lib/data';
import { useCurrency, CURRENCY_LIST } from '@/context/CurrencyContext';

type MegaKey = 'packages' | 'stories' | 'b2b';

const NAV_ITEMS: { href: string; label: string; mega?: MegaKey }[] = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages', mega: 'packages' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/stories', label: 'Stories', mega: 'stories' },
  { href: '/b2b', label: 'B2B', mega: 'b2b' },
  { href: '/about', label: 'About' },
];

const B2B_OPTIONS = [
  {
    icon: 'briefcase',
    type: 'Corporate Custom Travel',
    title: 'Corporate custom travel',
    desc: 'Offsites, incentive trips and client entertainment planned around your calendar.',
  },
  {
    icon: 'trophy',
    type: 'Sports Travel — Team',
    title: 'Sports travel',
    desc: 'Team and individual athlete logistics for tournaments and training abroad.',
  },
  {
    icon: 'percent',
    type: 'Travel Agency — Bulk Reseller',
    title: 'Travel agencies',
    desc: 'Bulk packages at a negotiated margin % to list and sell on your own portal.',
  },
];

function formatStoryDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MegaKey | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency, currencyInfo } = useCurrency();

  const [regions, setRegions] = useState<Region[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadedRegionsAndDests, setLoadedRegionsAndDests] = useState(false);
  const [loadedStories, setLoadedStories] = useState(false);

  useEffect(() => {
    if (isCustomerLoggedIn()) {
      fetchCustomerMe().then(setCustomer).catch(() => customerLogout());
    }
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setActiveMenu(null);
    setCurrencyOpen(false);
  }, [pathname]);

  // Close currency dropdown on outside click
  useEffect(() => {
    if (!currencyOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.currency-switcher')) setCurrencyOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [currencyOpen]);

  const handleLogout = () => {
    customerLogout();
    setCustomer(null);
    router.push('/');
  };

  const ensureRegionsAndDestinations = () => {
    if (loadedRegionsAndDests) return;
    setLoadedRegionsAndDests(true);
    Promise.all([fetchRegions(), fetchDestinations()])
      .then(([r, d]) => { setRegions(r); setDestinations(d); })
      .catch(console.error);
  };

  const ensureStories = () => {
    if (loadedStories) return;
    setLoadedStories(true);
    fetchStories()
      .then(s => setStories(s.filter(story => story.status === 'approved')))
      .catch(console.error);
  };

  const handleItemHover = (item: { mega?: MegaKey }) => {
    if (item.mega === 'packages') ensureRegionsAndDestinations();
    if (item.mega === 'stories') ensureStories();
    setActiveMenu(item.mega ?? null);
  };

  const regionStats = useMemo(() => {
    const byRegion = new Map<string, Destination[]>();
    for (const d of destinations) {
      const list = byRegion.get(d.region) ?? [];
      list.push(d);
      byRegion.set(d.region, list);
    }
    const orderedNames = regions.length > 0 ? regions.map(r => r.name) : Array.from(byRegion.keys()).sort();
    return orderedNames
      .filter(name => byRegion.has(name))
      .map(name => {
        const list = byRegion.get(name)!;
        return { name, destinations: list, trips: list.reduce((sum, d) => sum + (d.count || 0), 0) };
      });
  }, [regions, destinations]);

  const latestStories = useMemo(() => {
    return [...stories]
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 4);
  }, [stories]);

  const navLinks = (
    <>
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? 'active' : ''}
          onMouseEnter={() => handleItemHover(item)}
          style={item.mega ? {display:'inline-flex', alignItems:'center', gap:5} : undefined}
        >
          {item.label}
          {item.mega && (
            <Icon
              name="chevron-down"
              size={11}
              stroke={2}
              style={{
                transform: activeMenu === item.mega ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform .2s ease',
              }}
            />
          )}
        </Link>
      ))}
      {customer ? (
        <Link href="/my-enquiries" style={{fontSize:13, color: pathname === '/my-enquiries' ? 'var(--clay)' : 'var(--ink-2)'}}>My Enquiries</Link>
      ) : null}
    </>
  );

  const navActions = (
    <>
      <div className="currency-switcher" style={{position:'relative'}}>
        <button
          className="currency-btn"
          onClick={() => setCurrencyOpen(o => !o)}
          aria-label="Switch currency"
        >
          <span className="currency-flag">{currencyInfo.flag}</span>
          <span className="currency-code">{currency}</span>
          <Icon name={currencyOpen ? 'chevron-up' : 'chevron-down'} size={10} stroke={2} />
        </button>
        {currencyOpen && (
          <div className="currency-drop">
            {CURRENCY_LIST.map(c => (
              <button
                key={c.code}
                className={'currency-opt' + (currency === c.code ? ' active' : '')}
                onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
              >
                <span>{c.flag}</span>
                <span style={{flex:1}}>{c.code}</span>
                <span style={{color:'var(--muted)', fontSize:11}}>{c.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {customer ? (
        <Link href="/profile" style={{fontSize:13, color:'var(--ink-2)', borderBottom: '2px solid var(--clay)', padding: 4}}>Hi, {customer.name.split(' ')[0]}</Link>
      ) : (
        <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
      )}
      <Link href="/packages" className="btn btn-primary btn-sm">
        Plan a trip
      </Link>
      {customer ? (
        <button onClick={handleLogout} className="btn btn-ghost btn-sm">Log out</button>
      ) : null}
    </>
  );

  return (
    <nav className="nav" onMouseLeave={() => setActiveMenu(null)}>
      <div className="nav-inner">
        <Link href="/" className="brand" style={{display:'flex', alignItems:'center', gap:10}}>
          <Image src="/logo-tp.png" alt="Kushmud" width={508} height={491} style={{ height: 64, width: 'auto' }} />
          <span className="brand-wrap">
            <span className="brand-name">Kushmud</span>
            <span className="brand-sub">Travel &amp; Tourism</span>
          </span>
        </Link>
        <div className="nav-links">{navLinks}</div>
        <div className="nav-actions">
          {navActions}
        </div>
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {activeMenu === 'packages' && (
        <div className="nav-mega">
          <div className="nav-mega-inner">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:24}}>
              <span className="eyebrow">— Browse by region</span>
              <Link href="/packages" style={{fontSize:13, color:'var(--clay)'}}>Browse all packages →</Link>
            </div>
            {regionStats.length === 0 ? (
              <p style={{fontSize:13, color:'var(--muted)'}}>Loading regions…</p>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:8}}>
                {regionStats.map(r => (
                  <Link key={r.name} href={`/packages?region=${encodeURIComponent(r.name)}`} className="nav-mega-row">
                    <span className="ic"><Icon name="globe" size={16}/></span>
                    <span>
                      <span className="nav-mega-row-name" style={{display:'block'}}>{r.name}</span>
                      <span className="nav-mega-row-meta">{r.destinations.length} destination{r.destinations.length !== 1 ? 's' : ''} · {r.trips} trips</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeMenu === 'stories' && (
        <div className="nav-mega">
          <div className="nav-mega-inner">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:24}}>
              <span className="eyebrow">— Field Journal</span>
              <Link href="/stories" style={{fontSize:13, color:'var(--clay)'}}>See all stories →</Link>
            </div>
            {latestStories.length === 0 ? (
              <p style={{fontSize:13, color:'var(--muted)'}}>Loading stories…</p>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24}}>
                {latestStories.map(s => (
                  <Link key={s.id} href={`/stories/${s.id}`} className="nav-mega-story">
                    <img src={s.img} alt={s.title}/>
                    {s.tag && <span style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--clay)'}}>{s.tag}</span>}
                    <h5>{s.title}</h5>
                    <span style={{fontSize:12, color:'var(--muted)'}}>{formatStoryDate(s.published_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeMenu === 'b2b' && (
        <div className="nav-mega">
          <div className="nav-mega-inner">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:24}}>
              <span className="eyebrow">— Travel for teams</span>
              <Link href="/b2b#quote" style={{fontSize:13, color:'var(--clay)'}}>Get a quote →</Link>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
              {B2B_OPTIONS.map(o => (
                <Link key={o.type} href={`/b2b?type=${encodeURIComponent(o.type)}#quote`} className="nav-mega-b2b-card">
                  <span className="ic" style={{width:44, height:44, flexShrink:0}}><Icon name={o.icon} size={18}/></span>
                  <span>
                    <span className="nav-mega-row-name" style={{display:'block', marginBottom:4}}>{o.title}</span>
                    <span style={{fontSize:13, color:'var(--ink-2)', lineHeight:1.5}}>{o.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={'nav-mobile' + (menuOpen ? ' is-open' : '')}>
        <div className="nav-mobile-links">{navLinks}</div>
        <div className="nav-mobile-actions">{navActions}</div>
      </div>
    </nav>
  );
};
