'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { customerLogin } from '@/lib/data';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const signupHref = redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await customerLogin(identifier.trim(), password);
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Link href="/" className="auth-close" aria-label="Close">
        <Icon name="x" size={16} />
      </Link>

      <div
        className="auth-visual"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&auto=format&fit=crop)` }}
      >
        <div className="auth-visual-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--serif)', fontSize: 22 }}>
            Kushmud<span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clay)' }} />
          </div>
          <div className="auth-visual-quote">
            "We don't try to cover the globe. We cover India and the UAE deeply, one considered trip at a time."
            <span>— The Kushmud planning team</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">
            Kushmud<span className="dot" />
          </div>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>Welcome back.</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: 15 }}>Log in to pick up where you left off.</p>

          {error && (
            <div style={{
              padding: '12px 16px', background: 'rgba(199, 154, 74, 0.1)', color: '#c79a4a',
              borderRadius: 4, fontSize: 13, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Icon name="x" size={12} /> {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="field-group">
              <label>Email or phone number</label>
              <input
                type="text"
                placeholder="you@email.com or +91 98765 43210"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: 8, padding: '16px 24px', justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <p style={{ marginTop: 28, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
            New to Kushmud? <Link href={signupHref} style={{ color: 'var(--clay)' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
