'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { Booking, isCustomerLoggedIn, fetchMyBookings } from '@/lib/data';
import { useCurrency } from '@/context/CurrencyContext';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'var(--forest)',
  pending: 'var(--clay)',
  cancelled: 'var(--muted)',
};

function StatusPill({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || 'var(--muted)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, textTransform: 'capitalize', color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 13, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function EnquiryDetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const { formatPrice } = useCurrency();
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: 32, maxWidth: 440, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{booking.id}</div>
        <h3 style={{ fontSize: 22, marginBottom: 16 }}>{booking.pkg}</h3>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DetailRow label="Status" value={<StatusPill status={booking.status} />} />
          <DetailRow label="Dates" value={booking.dates} />
          <DetailRow label="Travelers" value={`${booking.pax || 1} traveler${(booking.pax || 1) === 1 ? '' : 's'}`} />
          <DetailRow label="Traveler name" value={booking.name} />
          {booking.email && <DetailRow label="Email" value={booking.email} />}
          {booking.phone && <DetailRow label="Phone" value={booking.phone} />}
          <DetailRow label="Total" value={formatPrice(booking.total)} />
          {booking.created_at && (
            <DetailRow
              label="Submitted"
              value={new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
          )}
          {booking.remarks && (
            <div style={{ padding: '10px 0' }}>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>Remarks</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{booking.remarks}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn btn-clay btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function MyEnquiriesPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace('/login?redirect=/my-enquiries');
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (isCheckingAuth) return;
    fetchMyBookings().then(setBookings).finally(() => setIsLoading(false));
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading your enquiries...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>My Enquiries</span></div>
          <h1>My Enquiries.</h1>
        </div>
      </div>

      <div className="container page-content">
        {isLoading ? (
          <p style={{ color: 'var(--muted)' }}>Loading your enquiries...</p>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 48, border: '1px solid var(--line)', borderRadius: 4, textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: 20 }}>You haven&apos;t made any enquiries yet.</p>
            <Link href="/packages" className="btn btn-primary">Browse trips</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map(b => (
              <div key={b.id} className="enquiry-row" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                gap: 24, padding: 24, border: '1px solid var(--line)', borderRadius: 8,
                flexWrap: 'wrap', background: '#f7f6f4',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                    {b.id}
                  </div>
                  <h3 style={{ fontSize: 20, marginBottom: 4 }}>{b.pkg}</h3>
                  <div style={{ color: 'var(--ink-2)', fontSize: 14 }}>
                    {b.dates} · {b.pax || 1} traveler{(b.pax || 1) === 1 ? '' : 's'}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                    For any queries or changes, contact us on{' '}
                    <span
                      style={{ color: 'var(--forest)' }}
                    >
                      WhatsApp
                    </span>{' '}
                    or <Link href="/contact" style={{ color: 'var(--forest)', textDecoration: 'underline' }}>Contact Us</Link>.
                  </div>
                </div>
                <div className="enquiry-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <StatusPill status={b.status} />
                  <div style={{ fontWeight: 500 }}>{formatPrice(b.total)}</div>
                  {b.created_at && (
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Submitted {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedBooking(b)}>View details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <EnquiryDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </MainLayout>
  );
}
