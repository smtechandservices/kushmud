'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { PackageCard } from '@/components/PackageCard';
import { ConfirmModal } from '@/components/ConfirmModal';
import {
  Customer,
  Favorite,
  isCustomerLoggedIn,
  fetchCustomerMe,
  updateCustomerMe,
  fetchFavorites,
  fetchNewsletterStatus,
  subscribeToCustomerNewsletter,
  unsubscribeFromCustomerNewsletter,
  customerLogout,
} from '@/lib/data';

export default function ProfilePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(true);
  const [isTogglingNewsletter, setIsTogglingNewsletter] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const [pendingAction, setPendingAction] = useState<'unsubscribe' | 'logout' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace('/login?redirect=/profile');
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (isCheckingAuth) return;
    fetchCustomerMe()
      .then(c => {
        setCustomer(c);
        setName(c.name || '');
        setEmail(c.email || '');
        setPhone(c.phone || '');
      })
      .catch(() => {
        customerLogout();
        router.replace('/login?redirect=/profile');
      });
    fetchFavorites().then(setFavorites).finally(() => setIsLoadingFavorites(false));
    fetchNewsletterStatus()
      .then(status => setIsSubscribed(status.subscribed))
      .catch(() => {})
      .finally(() => setIsLoadingNewsletter(false));
  }, [isCheckingAuth, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const updated = await updateCustomerMe({ name, phone: phone || null });
      setCustomer(updated);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewsletterCheckboxChange = () => {
    if (isSubscribed) {
      setPendingAction('unsubscribe');
      return;
    }
    setIsTogglingNewsletter(true);
    setNewsletterError('');
    subscribeToCustomerNewsletter()
      .then(status => setIsSubscribed(status.subscribed))
      .catch(err => setNewsletterError(err instanceof Error ? err.message : 'Failed to update newsletter subscription.'))
      .finally(() => setIsTogglingNewsletter(false));
  };

  const handleConfirmPendingAction = async () => {
    if (pendingAction === 'logout') {
      customerLogout();
      router.push('/');
      return;
    }
    if (pendingAction === 'unsubscribe') {
      setIsConfirming(true);
      setNewsletterError('');
      try {
        const status = await unsubscribeFromCustomerNewsletter();
        setIsSubscribed(status.subscribed);
        setPendingAction(null);
      } catch (err) {
        setNewsletterError(err instanceof Error ? err.message : 'Failed to update newsletter subscription.');
        setPendingAction(null);
      } finally {
        setIsConfirming(false);
      }
    }
  };

  if (isCheckingAuth || !customer) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading your account...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Profile</span></div>
          <h1 style={{ fontSize: 64 }}>Hi, {customer.name.split(' ')[0]}.</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 40px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 64, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 20, marginBottom: 20 }}>Account details</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field-group">
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" value={email} disabled title="Email can't be changed" style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>
              <div className="field-group">
                <label>Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              {saveError && <span style={{ color: 'var(--clay)', fontSize: 13 }}>{saveError}</span>}
              {saveSuccess && <span style={{ color: 'var(--forest)', fontSize: 13 }}>Profile updated.</span>}
              <button className="btn btn-clay" type="submit" disabled={isSaving} style={{ marginTop: 8 }}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </form>

            <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />

            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Newsletter</h3>
            {isLoadingNewsletter ? (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Checking subscription...</p>
            ) : !customer.email ? (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Add an email above to manage your newsletter subscription.</p>
            ) : (
              <>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: isTogglingNewsletter ? 'default' : 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={handleNewsletterCheckboxChange}
                    disabled={isTogglingNewsletter}
                  />
                  {isSubscribed ? 'Subscribed to trip updates & offers' : 'Not subscribed to trip updates & offers'}
                </label>
                {newsletterError && <span style={{ color: 'var(--clay)', fontSize: 13, display: 'block', marginTop: 6 }}>{newsletterError}</span>}
              </>
            )}

            <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />

            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
              Member since {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={() => setPendingAction('logout')} className="btn btn-ghost btn-sm">Log out</button>
          </div>

          <div>
            <h3 style={{ fontSize: 20, marginBottom: 20 }}>Saved trips</h3>
            {isLoadingFavorites ? (
              <p style={{ color: 'var(--muted)' }}>Loading saved trips...</p>
            ) : favorites.length === 0 ? (
              <div style={{ padding: 48, border: '1px solid var(--line)', borderRadius: 4, textAlign: 'center' }}>
                <p style={{ color: 'var(--muted)', marginBottom: 20 }}>You haven&apos;t saved any trips yet.</p>
                <Link href="/packages" className="btn btn-primary">Browse trips</Link>
              </div>
            ) : (
              <div className="cards cards-2">
                {favorites.map(f => <PackageCard key={f.id} pkg={f.package} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={pendingAction !== null}
        title={pendingAction === 'logout' ? 'Log out?' : 'Unsubscribe from newsletter?'}
        message={
          pendingAction === 'logout'
            ? "You'll need to log in again to access your account and saved trips."
            : "You'll stop receiving trip updates and offers by email."
        }
        confirmLabel={pendingAction === 'logout' ? 'Log out' : 'Unsubscribe'}
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
        isConfirming={isConfirming}
      />
    </MainLayout>
  );
}
