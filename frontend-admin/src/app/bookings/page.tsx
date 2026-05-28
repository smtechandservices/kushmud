'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchBookings, updateBookingStatus, Booking } from '@/lib/data';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatus(id, newStatus);
      await loadData();
    } catch (e) {
      alert('Failed to update booking status');
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search bookings by customer, reference, or package…</span>
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
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th style={{textAlign:'right'}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td><span style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)'}}>{b.id}</span></td>
                      <td>
                        <div className="who">
                          <div className="ava" style={{ backgroundImage:`url(${b.avatar})` }}></div>
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{b.pkg}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{b.dates}</td>
                      <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <span className={'status ' + b.status}><span className="d"></span>{b.status}</span>
                          {b.status === 'pending' && (
                            <div style={{display:'inline-flex', gap:4}}>
                              <button 
                                className="btn btn-sm btn-ghost" 
                                style={{padding: '2px 6px', fontSize: 10, background: 'rgba(31,122,77,0.1)', color: 'var(--forest)', height: 'auto'}}
                                onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                              >
                                Confirm
                              </button>
                              <button 
                                className="btn btn-sm btn-ghost" 
                                style={{padding: '2px 6px', fontSize: 10, background: 'rgba(199,154,74,0.1)', color: '#c79a4a', height: 'auto'}}
                                onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{textAlign:'right', fontFamily:'var(--serif)', fontSize:15, letterSpacing:'-0.005em'}}>${b.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
