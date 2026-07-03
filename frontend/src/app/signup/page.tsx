'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { customerSignup } from '@/lib/data';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const loginHref = redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() && !phone.trim()) {
      setError('Please provide an email address or a phone number.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await customerSignup({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
      });
      router.push(redirectParam || '/');
    } catch (err: any) {
      setError(err?.message || 'Failed to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Link href="/" className="auth-close" aria-label="Close">
        <Icon name="x" size={16} />
      </Link>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">
            Kushmud<span className="dot" />
          </div>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>Join Kushmud.</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: 15 }}>Create an account to start planning your trip.</p>

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
              <label>Full name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>— or —</div>
            <div className="field-group">
              <label>Phone number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
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
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p style={{ marginTop: 28, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
            Already have an account? <Link href={loginHref} style={{ color: 'var(--clay)' }}>Log in</Link>
          </p>
        </div>
      </div>

      <div
        className="auth-visual"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&auto=format&fit=crop)` }}
      >
        <div className="auth-visual-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--serif)', fontSize: 22, alignSelf: 'flex-end' }}>
            Kushmud<span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clay)' }} />
          </div>
          <div className="auth-visual-quote" style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
            "Curated trips across India and the UAE, planned by people who've actually slept there."
            <span>— The Kushmud planning team</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
