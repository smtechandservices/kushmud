'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { Package, isCustomerLoggedIn, fetchFavoriteIds, toggleFavorite } from '@/lib/data';

interface PackageCardProps {
  pkg: Package;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const [fav, setFav] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = isCustomerLoggedIn();
    setLoggedIn(isLoggedIn);
    if (!isLoggedIn) return;
    let cancelled = false;
    fetchFavoriteIds().then(ids => {
      if (!cancelled) setFav(ids.includes(String(pkg.id)));
    });
    return () => { cancelled = true; };
  }, [pkg.id]);

  const toggleFav = async () => {
    try {
      setFav(await toggleFavorite(String(pkg.id)));
    } catch (e) {
      // ignore failures (e.g. network error)
    }
  };

  return (
    <div className="card">
      <Link href={`/packages/${pkg.id}`} className="card-img" style={{ backgroundImage: `url(${pkg.img})` }}>
        {pkg.badge && <span className="card-badge">{pkg.badge}</span>}
        {loggedIn && (
          <button
            className={'card-fav ' + (fav ? 'active' : '')}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(); }}
          >
            <Icon name={fav ? 'heart-fill' : 'heart'} size={14}/>
          </button>
        )}
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
