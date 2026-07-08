'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { fetchStoryById, Story } from '@/lib/data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function StoryDetailPage() {
  const { id } = useParams();
  const idStr = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  const storyId = idStr ? Number(idStr) : NaN;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!idStr || Number.isNaN(storyId)) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    async function load() {
      try {
        const data = await fetchStoryById(storyId);
        setStory(data);
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [idStr, storyId]);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </MainLayout>
    );
  }

  if (notFound || !story) {
    return (
      <MainLayout>
        <div style={{ padding: '120px 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontFamily: 'var(--serif)', marginBottom: 12 }}>We couldn't find that story.</p>
          <Link href="/stories" className="btn btn-ghost">Browse all stories</Link>
        </div>
      </MainLayout>
    );
  }

  const hasBody = !!(story.body && story.body.trim().length > 0);
  const bodyText = hasBody ? (story.body as string) : story.excerpt;

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <Link href="/stories">Stories</Link> / <span>{story.title}</span></div>
        </div>
      </div>

      <div className="container page-content-story">
        <div style={{ aspectRatio: '16/9', backgroundImage: `url(${story.img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 4, marginBottom: 40 }}></div>

        {story.tag && <span className="eyebrow" style={{ color: 'var(--clay)' }}>{story.tag}</span>}
        <h1 style={{ marginTop: 16, fontSize: 44, lineHeight: 1.1 }}>{story.title}</h1>
        <div style={{ marginTop: 20, fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', gap: 10, alignItems: 'center' }}>
          {story.author && <span>By {story.author}</span>}
          {story.author && <span>·</span>}
          <span>{formatDate(story.published_at)}</span>
        </div>

        <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--line)' }}>
          {!hasBody && (
            <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.04em', marginBottom: 24 }}>
              The full piece isn't available yet — here's a preview.
            </p>
          )}
          <div style={{ fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.75, color: 'var(--ink-2)' }}>
            {bodyText
              .split('\n')
              .filter(line => line.trim().length > 0)
              .map((line, i) => (
                <p key={i} style={{ marginBottom: 24 }}>{line}</p>
              ))}
          </div>
        </div>

        <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
          <Link href="/stories" className="btn btn-ghost">Back to Field Journal</Link>
        </div>
      </div>
    </MainLayout>
  );
}
