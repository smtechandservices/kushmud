'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PackageCard } from '@/components/PackageCard';
import { fetchPackages, Package } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { useCurrency } from '@/context/CurrencyContext';
import filtersData from '@/assets/packages-filters.json';

const { durations, months, sortOptions } = filtersData;

const PER_PAGE = 6;
const PRICE_MAX_FALLBACK = 20000;
const PRICE_CEILING_PADDING = 5000;

function durationMatches(d: number, bucket: string) {
  if (bucket === '3-5 days')   return d >= 3  && d <= 5;
  if (bucket === '6-9 days')   return d >= 6  && d <= 9;
  if (bucket === '10-14 days') return d >= 10 && d <= 14;
  if (bucket === '15+ days')   return d >= 15;
  return false;
}

function ListingContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchPackages().then(setPackages).catch(console.error);
  }, []);

  const types = useMemo(
    () => Array.from(new Set(packages.map(p => p.type))).sort(),
    [packages]
  );
  const regions = useMemo(
    () => Array.from(new Set(packages.map(p => p.region))).sort(),
    [packages]
  );

  const [typeFilters, setTypeFilters] = useState<Set<string>>(() => {
    const t = searchParams.get('type');
    return t ? new Set([t]) : new Set();
  });
  const [regionFilters, setRegionFilters] = useState<Set<string>>(() => {
    const r = searchParams.get('region');
    return r ? new Set([r]) : new Set();
  });
  const [durationFilters, setDurationFilters] = useState<Set<string>>(new Set());
  const [activeMonths,    setActiveMonths]    = useState<Set<number>>(() => {
    const m = searchParams.get('months');
    return m ? new Set(m.split(',').map(Number)) : new Set();
  });
  const priceCeiling = useMemo(
    () => packages.length ? Math.max(...packages.map(p => p.price)) + PRICE_CEILING_PADDING : PRICE_MAX_FALLBACK,
    [packages]
  );
  const [priceMax, setPriceMax] = useState(Infinity);
  const [sort,     setSort]     = useState('featured');
  const [page,     setPage]     = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function toggleSet<T>(s: Set<T>, val: T): Set<T> {
    const next = new Set(s);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  }

  function toggle(kind: 'type' | 'region' | 'duration' | 'month', val: string | number) {
    setPage(1);
    if (kind === 'type')     setTypeFilters(prev     => toggleSet(prev, val as string));
    if (kind === 'region')   setRegionFilters(prev   => toggleSet(prev, val as string));
    if (kind === 'duration') setDurationFilters(prev => toggleSet(prev, val as string));
    if (kind === 'month')    setActiveMonths(prev    => toggleSet(prev, val as number));
  }

  function clearAll() {
    setTypeFilters(new Set());
    setRegionFilters(new Set());
    setDurationFilters(new Set());
    setActiveMonths(new Set());
    setPriceMax(Infinity);
    setPage(1);
  }

  const hasFilters = typeFilters.size > 0 || regionFilters.size > 0 ||
                     durationFilters.size > 0 || activeMonths.size > 0 ||
                     priceMax !== Infinity;

  const filtered = useMemo(() => {
    let res = [...packages];
    if (typeFilters.size > 0)     res = res.filter(p => typeFilters.has(p.type));
    if (regionFilters.size > 0)   res = res.filter(p => regionFilters.has(p.region));
    if (durationFilters.size > 0) res = res.filter(p => [...durationFilters].some(b => durationMatches(p.duration, b)));
    if (priceMax !== Infinity)    res = res.filter(p => p.price <= priceMax);

    switch (sort) {
      case 'featured':   res.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.reviews - a.reviews); break;
      case 'price-asc':  res.sort((a, b) => a.price - b.price); break;
      case 'price-desc': res.sort((a, b) => b.price - a.price); break;
      case 'rating':     res.sort((a, b) => b.rating - a.rating); break;
      case 'duration':   res.sort((a, b) => a.duration - b.duration); break;
    }
    return res;
  }, [typeFilters, regionFilters, durationFilters, priceMax, sort, packages]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const sortLabel = sortOptions.find(o => o.value === sort)?.label ?? "Editor's pick";

  const activeTags: { label: string; remove: () => void }[] = [
    ...[...typeFilters].map(t     => ({ label: t,            remove: () => toggle('type', t) })),
    ...[...regionFilters].map(r   => ({ label: r,            remove: () => toggle('region', r) })),
    ...[...durationFilters].map(d => ({ label: d,            remove: () => toggle('duration', d) })),
    ...[...activeMonths].map(i    => ({ label: months[i],    remove: () => toggle('month', i) })),
    ...(priceMax !== Infinity     ? [{ label: `Up to ${formatPrice(priceMax)}`, remove: () => { setPriceMax(Infinity); setPage(1); } }] : []),
  ];

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>All Packages</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1>All Trips, <em style={{ fontStyle: 'italic' }}>everywhere we go.</em></h1>
              <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 540, fontSize: 15 }}>
                Filter by region, mood, or duration. Each trip is a starting point — every itinerary can be tailored.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="listing">

          {/* ── Sidebar filters ── */}
          <button
            type="button"
            className="filters-toggle-btn"
            onClick={() => setFiltersOpen(o => !o)}
          >
            <Icon name="filter" size={13} />
            Filters{hasFilters ? ` (${activeTags.length})` : ''}
            <Icon
              name="arrow-right"
              size={12}
              stroke={2}
              style={{ marginLeft: 'auto', transform: filtersOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
            />
          </button>
          <aside className={'filters' + (filtersOpen ? ' is-open' : '')}>
            <div className="filter-group">
              <h5>
                Filters
                {hasFilters && <button onClick={clearAll}>Clear all</button>}
              </h5>
            </div>

            <div className="filter-group">
              <h5>Trip type</h5>
              {types.map(tp => (
                <div
                  key={tp}
                  className={'fopt fopt-check ' + (typeFilters.has(tp) ? 'on' : '')}
                  onClick={() => toggle('type', tp)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="box">{typeFilters.has(tp) && <Icon name="check" size={9} stroke={3} />}</span>
                    <span>{tp}</span>
                  </div>
                  <span className="fopt-count">{packages.filter(p => p.type === tp).length}</span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h5>Region</h5>
              {regions.map(r => (
                <div
                  key={r}
                  className={'fopt fopt-check ' + (regionFilters.has(r) ? 'on' : '')}
                  onClick={() => toggle('region', r)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="box">{regionFilters.has(r) && <Icon name="check" size={9} stroke={3} />}</span>
                    <span>{r}</span>
                  </div>
                  <span className="fopt-count">{packages.filter(p => p.region === r).length}</span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h5>Price range</h5>
              <div style={{ padding: '4px 0 8px' }}>
                <input
                  type="range"
                  min={500}
                  max={priceCeiling}
                  step={100}
                  value={priceMax === Infinity ? priceCeiling : priceMax}
                  onChange={e => { setPriceMax(Number(e.target.value)); setPage(1); }}
                  style={{ width: '100%', accentColor: 'var(--clay)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 6 }}>
                  <span>{formatPrice(500)}</span>
                  <span style={{ color: priceMax !== Infinity ? 'var(--clay)' : 'var(--muted)' }}>
                    Up to {formatPrice(priceMax === Infinity ? priceCeiling : priceMax)}
                  </span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h5>Duration</h5>
              {durations.map(d => (
                <div
                  key={d}
                  className={'fopt fopt-check ' + (durationFilters.has(d) ? 'on' : '')}
                  onClick={() => toggle('duration', d)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="box">{durationFilters.has(d) && <Icon name="check" size={9} stroke={3} />}</span>
                    <span>{d}</span>
                  </div>
                  <span className="fopt-count">
                    {packages.filter(p => durationMatches(p.duration, d)).length}
                  </span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <h5>Travel month</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 4 }}>
                {months.map((m, i) => {
                  const on = activeMonths.has(i);
                  return (
                    <div
                      key={m}
                      onClick={() => toggle('month', i)}
                      style={{
                        padding: '6px 0', textAlign: 'center', fontSize: 12,
                        border: '1px solid var(--line-2)', borderRadius: 2,
                        background: on ? 'var(--forest)' : 'var(--paper)',
                        color: on ? 'white' : 'var(--ink-2)',
                        cursor: 'pointer',
                        fontFamily: 'var(--mono)', letterSpacing: '0.05em',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── Results panel ── */}
          <div className="listing-results">
            <div className="listing-toolbar">
              <span className="listing-count">
                <strong>{filtered.length}</strong> trip{filtered.length !== 1 ? 's' : ''} found
              </span>

              <div style={{ position: 'relative' }}>
                <div
                  className="sort"
                  onClick={() => setSortOpen(o => !o)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <span className="mono">Sort:</span>
                  <span>{sortLabel}</span>
                  <Icon
                    name="arrow-right"
                    size={12}
                    stroke={2}
                    style={{ transform: sortOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }}
                  />
                </div>
                {sortOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 20,
                    background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 4,
                    minWidth: 200, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  }}>
                    {sortOptions.map(o => (
                      <div
                        key={o.value}
                        onClick={() => { setSort(o.value); setSortOpen(false); setPage(1); }}
                        style={{
                          padding: '10px 16px', fontSize: 13, cursor: 'pointer',
                          background: sort === o.value ? 'var(--forest)' : 'transparent',
                          color: sort === o.value ? 'white' : 'var(--ink)',
                        }}
                      >
                        {o.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {activeTags.length > 0 && (
              <div className="listing-tags">
                {activeTags.map(t => (
                  <span key={t.label} className="tag">
                    {t.label}
                    <button onClick={t.remove}><Icon name="x" size={12} /></button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', textDecoration: 'underline' }}
                >
                  Clear all
                </button>
              </div>
            )}

            {paged.length > 0 ? (
              <div className="cards cards-2">
                {paged.map(p => <PackageCard key={p.id} pkg={p} />)}
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontFamily: 'var(--serif)', marginBottom: 12 }}>No trips match your filters.</p>
                <button className="btn btn-ghost" onClick={clearAll}>Clear all filters</button>
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 64, gap: 6 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={safePage === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{ opacity: safePage === 1 ? 0.4 : 1 }}
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={'btn btn-sm ' + (n === safePage ? 'btn-primary' : 'btn-ghost')}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{ opacity: safePage === totalPages ? 0.4 : 1 }}
                >
                  Next ›
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default function ListingPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      }>
        <ListingContent />
      </Suspense>
    </MainLayout>
  );
}
