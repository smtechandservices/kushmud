'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';
import Link from 'next/link';
import { fetchStories, Story } from '@/lib/data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetchStories().then(setStories).catch(console.error);
  }, []);

  const [featured, ...rest] = stories;

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
        {featured && (
          <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80, marginBottom: 120}}>
            <div style={{position: 'relative'}}>
              <div style={{aspectRatio: '16/9', backgroundImage: `url(${featured.img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 4}}></div>
              <div style={{marginTop: 40}}>
                <span className="eyebrow" style={{color: 'var(--clay)'}}>Featured Dispatch</span>
                <h2 style={{marginTop: 16, fontSize: 44, lineHeight: 1.1}}>{featured.title}</h2>
                <p style={{marginTop: 24, fontSize: 18, lineHeight: 1.6, color: 'var(--ink-2)', fontFamily: 'var(--serif)'}}>
                  {featured.excerpt}
                </p>
                <Link href={`/stories/${featured.id}`} className="btn btn-link" style={{marginTop: 32}}>Read the essay</Link>
              </div>
            </div>
            <aside>
              <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid var(--line)'}}>Latest Entries</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
                {rest.map(s => (
                  <div key={s.id} style={{display: 'flex', gap: 24}}>
                    <div style={{width: 100, height: 100, borderRadius: 2, backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0}}></div>
                    <div>
                      <span className="eyebrow" style={{fontSize: 9, opacity: 0.6}}>{s.tag} · {formatDate(s.published_at)}</span>
                      <h5 style={{fontSize: 18, fontFamily: 'var(--serif)', marginTop: 4, lineHeight: 1.3}}>{s.title}</h5>
                      <p style={{fontSize: 13, color: 'var(--muted)', marginTop: 8}} className="clamp-2">{s.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        <div style={{padding: '80px 0', borderTop: '1px solid var(--line)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48}}>
            <h2>Archives</h2>
          </div>
          <div className="cards">
            {stories.map(s => (
              <div key={s.id} className="card">
                <div className="card-img wide" style={{backgroundImage: `url(${s.img})`}}></div>
                <div>
                  <div className="card-meta"><span>{s.tag}</span><span>{formatDate(s.published_at)}</span></div>
                  <h3>{s.title}</h3>
                  <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 12}}>{s.excerpt}</p>
                </div>
                <div className="card-foot">
                  <span style={{fontSize: 12, color: 'var(--muted)'}}>By {s.author}</span>
                  <Link href={`/stories/${s.id}`} className="card-link">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
