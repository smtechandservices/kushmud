'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon';
import { Package } from '@/lib/data';

interface PackageCardProps {
  pkg: Package;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const [fav, setFav] = useState(false);
  
  return (
    <div className="card">
      <Link href={`/packages/${pkg.id}`} className="card-img" style={{ backgroundImage: `url(${pkg.img})` }}>
        {pkg.badge && <span className="card-badge">{pkg.badge}</span>}
        <button 
          className={'card-fav ' + (fav ? 'active' : '')} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFav(!fav); }}
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
          <span className="from">From</span>${pkg.price.toLocaleString()}
        </div>
        <Link href={`/packages/${pkg.id}`} className="card-link">
          View itinerary
        </Link>
      </div>
    </div>
  );
};
