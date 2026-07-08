'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchBookings, updateBookingStatus, Booking } from '@/lib/data';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }) + ' IST';
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--line)'}}>
      <span style={{color: 'var(--muted)', fontSize: 13}}>{label}</span>
      <span style={{fontSize: 13, textAlign: 'right'}}>{value}</span>
    </div>
  );
}

interface BookingDetailsModalProps {
  booking: Booking;
  isBusy: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

function BookingDetailsModal({ booking, isBusy, onClose, onConfirm, onCancel }: BookingDetailsModalProps) {
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
        style={{background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: 32, maxWidth: 440, width: '100%'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 6}}>{booking.id}</div>
        <h3 style={{fontSize: 22, marginBottom: 16}}>{booking.pkg}</h3>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DetailRow label="Status" value={<span className={'status ' + booking.status}><span className="d"></span>{booking.status}</span>} />
          <DetailRow label="Dates" value={booking.dates} />
          <DetailRow label="Travelers" value={`${booking.pax ?? 1} traveler${(booking.pax ?? 1) === 1 ? '' : 's'}`} />
          <DetailRow label="Customer" value={booking.name} />
          {booking.email && <DetailRow label="Email" value={booking.email} />}
          {booking.phone && <DetailRow label="Phone" value={booking.phone} />}
          <DetailRow label="Total" value={`₹${booking.total.toLocaleString()}`} />
          {booking.created_at && (
            <DetailRow
              label="Submitted"
              value={formatDateTime(booking.created_at)}
            />
          )}
          {booking.remarks && (
            <div style={{padding: '10px 0'}}>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Remarks</div>
              <div style={{fontSize: 13, lineHeight: 1.5}}>{booking.remarks}</div>
            </div>
          )}
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24, gap: 10}}>
          <div style={{display: 'flex', gap: 10}}>
            {booking.status === 'pending' && (
              <>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{background: 'rgba(199,154,74,0.1)', color: '#c79a4a'}}
                  disabled={isBusy}
                  onClick={() => onCancel(booking.id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  disabled={isBusy}
                  onClick={() => onConfirm(booking.id)}
                >
                  Confirm
                </button>
              </>
            )}
            <button className="btn btn-sm btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.pkg.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q) ||
      (b.destination ?? '').toLowerCase().includes(q)
    );
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsBusy(true);
    try {
      await updateBookingStatus(id, newStatus);
      await loadData();
      setSelectedBooking(null);
    } catch (e) {
      alert('Failed to update booking status');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <input
              type="text"
              placeholder="Search bookings by customer, reference, or package…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Bookings</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Manage all trip reservations and statuses.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>Loading bookings...</div>
            ) : (
              <div style={{overflowX: 'auto'}}>
              <table className="dtable" style={{whiteSpace: 'nowrap'}}>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th style={{textAlign:'center'}}>Pax</th>
                    <th>Package</th>
                    <th>Destination</th>
                    <th>Dates</th>
                    <th>Booked On</th>
                    <th>Status</th>
                    <th style={{textAlign:'right'}}>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td><span style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)'}}>{b.id}</span></td>
                      <td>
                        <div className="who" style={{cursor:'pointer'}} onClick={() => setSelectedBooking(b)}>
                          <div className="ava" style={{ backgroundImage:`url(${b.avatar})` }}></div>
                          <span>{b.name}</span>
                          {b.remarks && (
                            <span title={b.remarks} style={{display:'inline-flex', color:'var(--muted)', cursor:'pointer'}}>
                              <Icon name="book" size={12}/>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{b.pax ?? '—'}</td>
                      <td style={{color:'var(--ink-2)'}}>{b.pkg}</td>
                      <td style={{color:'var(--ink-2)'}}>{b.destination ?? '—'}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{b.dates}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{b.created_at ? formatDateTime(b.created_at) : '—'}</td>
                      <td>
                        <span className={'status ' + b.status}><span className="d"></span>{b.status}</span>
                      </td>
                      <td style={{textAlign:'right', fontFamily:'var(--serif)', fontSize:15, letterSpacing:'-0.005em'}}>₹{b.total.toLocaleString()}</td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setSelectedBooking(b)}>View</button>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>
                        {bookings.length === 0 ? 'No bookings found.' : 'No bookings match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isBusy={isBusy}
          onClose={() => setSelectedBooking(null)}
          onConfirm={id => handleStatusUpdate(id, 'confirmed')}
          onCancel={id => handleStatusUpdate(id, 'cancelled')}
        />
      )}
    </div>
  );
}
