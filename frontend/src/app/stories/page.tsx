'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';
import Link from 'next/link';

const STORIES = [
  {
    title: "Six Mornings in the Thar Desert",
    excerpt: "Notes on the quality of light, the architecture of sand, and why you should always carry a second camera battery.",
    date: "April 12, 2026",
    author: "Liam Thorne",
    img: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&auto=format&fit=crop",
    tag: "Field Notes"
  },
  {
    title: "The Art of the Slow Thali",
    excerpt: "How a family-run kitchen in Jodhpur changed our perspective on the midday meal.",
    date: "March 28, 2026",
    author: "Sarah Chen",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop",
    tag: "Culture"
  },
  {
    title: "Beyond the Burj",
    excerpt: "Discovering the quiet, historic courtyards of Old Dubai at sunrise.",
    date: "February 14, 2026",
    author: "Elena Rossi",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop",
    tag: "City Guide"
  }
];

export default function StoriesPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Stories</span></div>
          <h1 style={{fontSize:64}}>Field Journal, <em style={{fontStyle:'italic'}}>dispatch from the road.</em></h1>
          <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>Essays, photography, and considered guides from our planners in India and the UAE.</p>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80, marginBottom: 120}}>
          <div style={{position: 'relative'}}>
            <div style={{aspectRatio: '16/9', backgroundImage: 'url(https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 4}}></div>
            <div style={{marginTop: 40}}>
              <span className="eyebrow" style={{color: 'var(--clay)'}}>Featured Dispatch</span>
              <h2 style={{marginTop: 16, fontSize: 44, lineHeight: 1.1}}>The Architecture of Silence: Heritage Haveli Stays</h2>
              <p style={{marginTop: 24, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-2)', fontFamily: 'var(--serif)'}}>
                In the heart of the Pink City, we found a courtyard where the only sound was the fountain and the rustle of pigeon wings. This is why we travel—to find the spaces that haven't changed in three centuries.
              </p>
              <Link href="/stories" className="btn btn-link" style={{marginTop: 32}}>Read the essay</Link>
            </div>
          </div>
          <aside>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--line)'}}>Latest Entries</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
              {STORIES.map((s, i) => (
                <div key={i} style={{display: 'flex', gap: 24}}>
                  <div style={{width: 100, height: 100, borderRadius: 2, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0}}></div>
                  <div>
                    <span className="eyebrow" style={{fontSize: 9, opacity: 0.6}}>{s.tag} · {s.date}</span>
                    <h5 style={{fontSize: 18, fontFamily: 'var(--serif)', marginTop: 4, lineHeight: 1.3}}>{s.title}</h5>
                    <p style={{fontSize: 13, color: 'var(--muted)', marginTop: 8}} className="clamp-2">{s.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div style={{padding: '80px 0', borderTop: '1px solid var(--line)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48}}>
            <h2>Archives</h2>
            <button className="btn btn-ghost">View all stories</button>
          </div>
          <div className="cards">
            {STORIES.map((s, i) => (
              <div key={i} className="card">
                <div className="card-img wide" style={{backgroundImage: `url(${s.img})`}}></div>
                <div>
                  <div className="card-meta"><span>{s.tag}</span><span>{s.date}</span></div>
                  <h3>{s.title}</h3>
                  <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 12}}>{s.excerpt}</p>
                </div>
                <div className="card-foot">
                  <span style={{fontSize: 12, color: 'var(--muted)'}}>By {s.author}</span>
                  <Link href="/stories" className="card-link">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
