'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { Package } from '@/lib/data';

interface PackageCardProps {
  pkg: Package;
}

const FAVORITES_KEY = 'kushmud:favorites';

function readFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    // ignore write failures (e.g. storage disabled)
  }
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(readFavorites().includes(String(pkg.id)));
  }, [pkg.id]);

  const toggleFav = () => {
    const id = String(pkg.id);
    const current = readFavorites();
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    writeFavorites(next);
    setFav(next.includes(id));
  };

  return (
    <div className="card">
      <Link href={`/packages/${pkg.id}`} className="card-img" style={{ backgroundImage: `url(${pkg.img})` }}>
        {pkg.badge && <span className="card-badge">{pkg.badge}</span>}
        <button 
          className={'card-fav ' + (fav ? 'active' : '')} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(); }}
        >
          <Icon name={fav ? 'heart-fill' : 'heart'} size={14}/>
        </button>
        <div className="card-rating">
          <Icon name="star" size={10}/> {pkg.rating} <span style={{opacity:.7}}>({pkg.reviews})</span>
        </div>
      </Link>
      <div>
        <div className="card-meta">
          <span>{pkg.region} · {pkg.type}</span>
          <span>{pkg.duration} days</span>
        </div>
        <Link href={`/packages/${pkg.id}`}>
          <h3>{pkg.title}</h3>
        </Link>
        <p style={{color:'var(--ink-2)', fontSize:14, lineHeight:1.5}} className="clamp-2">{pkg.blurb}</p>
      </div>
      <div className="card-foot">
        <div className="card-price">
          <span className="from">From</span>₹{pkg.price.toLocaleString()}
        </div>
        <Link href={`/packages/${pkg.id}`} className="card-link">
          View itinerary
        </Link>
      </div>
    </div>
  );
};
