'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchBookings, Booking } from '@/lib/data';

interface Customer {
  name: string;
  avatar: string;
  email: string;
  trips: number;
  totalSpend: number;
  lastBooking: string;
  status: string;
}

export default function CustomersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const b of bookings) {
      const existing = map.get(b.name);
      if (existing) {
        existing.trips += 1;
        existing.totalSpend += b.total;
        existing.lastBooking = b.dates;
        if (b.status === 'confirmed') existing.status = 'active';
      } else {
        map.set(b.name, {
          name: b.name,
          avatar: b.avatar,
          email: '',
          trips: 1,
          totalSpend: b.total,
          lastBooking: b.dates,
          status: b.status === 'confirmed' ? 'active' : 'pending',
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [bookings]);

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search customers…</span>
          </div>
          <button className="btn btn-ghost btn-sm">Export CSV</button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Customers</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {customers.length} unique travelers across {bookings.length} bookings.
              </p>
            </div>
          </div>

          {/* KPI summary cards */}
          <div className="kpis" style={{marginBottom: 24}}>
            <div className="kpi">
              <div className="lbl">Total Customers</div>
              <div className="v">{customers.length}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Active Travelers</div>
              <div className="v">{customers.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Total Revenue</div>
              <div className="v">${customers.reduce((s, c) => s + c.totalSpend, 0).toLocaleString()}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Avg. Spend / Customer</div>
              <div className="v">
                ${customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpend, 0) / customers.length).toLocaleString() : 0}
              </div>
            </div>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading customers…</div>
            ) : customers.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="users" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No customer data yet. Bookings will populate this list.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Trips</th>
                    <th>Total Spend</th>
                    <th>Last Booking</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.name}>
                      <td>
                        <div className="who">
                          <div className="ava" style={{ backgroundImage:`url(${c.avatar})` }}></div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td style={{fontFamily:'var(--mono)', fontSize:13}}>{c.trips}</td>
                      <td style={{fontFamily:'var(--serif)', fontSize:15}}>${c.totalSpend.toLocaleString()}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{c.lastBooking}</td>
                      <td>
                        <span className={'status ' + (c.status === 'active' ? 'confirmed' : 'pending')}>
                          <span className="d"></span>{c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
