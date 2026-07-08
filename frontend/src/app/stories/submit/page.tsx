'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import {
  Story,
  isCustomerLoggedIn,
  fetchCustomerMe,
  customerLogout,
  submitStory,
  fetchMyStories,
} from '@/lib/data';

const TAGS = ['Field Notes', 'Culture', 'City Guide'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatusBadge({ status }: { status: Story['status'] }) {
  const label = status === 'approved' ? 'Published' : status === 'rejected' ? 'Not approved' : 'Pending review';
  const color = status === 'approved' ? 'var(--forest)' : status === 'rejected' ? '#b8443a' : 'var(--clay)';
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color, border: `1px solid ${color}`, borderRadius: 20, padding: '3px 10px',
    }}>
      {label}
    </span>
  );
}

export default function SubmitStoryPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState(TAGS[0]);
  const [img, setImg] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [mine, setMine] = useState<Story[]>([]);
  const [loadingMine, setLoadingMine] = useState(true);

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace('/login?redirect=/stories/submit');
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  const loadMine = () => {
    setLoadingMine(true);
    fetchMyStories().then(setMine).finally(() => setLoadingMine(false));
  };

  useEffect(() => {
    if (isCheckingAuth) return;
    fetchCustomerMe().catch(() => {
      customerLogout();
      router.replace('/login?redirect=/stories/submit');
    });
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckingAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      await submitStory({
        title: title.trim(),
        excerpt: excerpt.trim(),
        body: body.trim() || undefined,
        img: img.trim(),
        tag,
      });
      setTitle('');
      setImg('');
      setExcerpt('');
      setBody('');
      setTag(TAGS[0]);
      setSubmitSuccess(true);
      loadMine();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <Link href="/stories">Stories</Link> / <span>Share your story</span></div>
          <h1 style={{ fontSize: 64 }}>Tell us <em style={{ fontStyle: 'italic' }}>where you went.</em></h1>
          <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 540, fontSize: 15 }}>
            Submit a dispatch from your own trip. Our editors review every submission before it goes live on the Field Journal.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 40px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'start' }}>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field-group">
              <label>Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="A Week Wandering the Kerala Backwaters" />
            </div>
            <div className="field-group">
              <label>Category</label>
              <select value={tag} onChange={e => setTag(e.target.value)}>
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Cover Image URL</label>
              <input required type="url" value={img} onChange={e => setImg(e.target.value)} placeholder="https://images.unsplash.com/…" />
            </div>
            <div className="field-group">
              <label>Excerpt</label>
              <textarea required rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="A short teaser for the story listing…" />
            </div>
            <div className="field-group">
              <label>Your story</label>
              <textarea required rows={10} value={body} onChange={e => setBody(e.target.value)} placeholder="Write the full story here…" />
            </div>

            {submitError && <span style={{ color: 'var(--clay)', fontSize: 13 }}>{submitError}</span>}
            {submitSuccess && <span style={{ color: 'var(--forest)', fontSize: 13 }}>Thanks — your story has been submitted for review.</span>}

            <button className="btn btn-clay" type="submit" disabled={isSubmitting} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
              {isSubmitting ? 'Submitting…' : 'Submit for review'}
            </button>
          </form>

          <aside style={{ position: 'sticky', top: 100 }}>
            <h4 style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              Your submissions
            </h4>
            {loadingMine ? (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Loading…</p>
            ) : mine.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>You haven't submitted a story yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {mine.map(s => (
                  <div key={s.id} style={{ paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <h5 style={{ fontSize: 15, fontFamily: 'var(--serif)', lineHeight: 1.3 }}>{s.title}</h5>
                      <StatusBadge status={s.status} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{formatDate(s.published_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>

        </div>
      </div>
    </MainLayout>
  );
}
