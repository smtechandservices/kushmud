'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchBookings, updateBookingStatus, Booking } from '@/lib/data';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      b.status.toLowerCase().includes(q)
    );
  });

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
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th style={{textAlign:'center'}}>Pax</th>
                    <th>Package</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th style={{textAlign:'right'}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td><span style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)'}}>{b.id}</span></td>
                      <td>
                        <div className="who">
                          <div className="ava" style={{ backgroundImage:`url(${b.avatar})` }}></div>
                          <span>{b.name}</span>
                          {b.remarks && (
                            <span title={b.remarks} style={{display:'inline-flex', color:'var(--muted)', cursor:'help'}}>
                              <Icon name="book" size={12}/>
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{b.pax ?? '—'}</td>
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
                      <td style={{textAlign:'right', fontFamily:'var(--serif)', fontSize:15, letterSpacing:'-0.005em'}}>₹{b.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>
                        {bookings.length === 0 ? 'No bookings found.' : 'No bookings match your search.'}
                      </td>
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
