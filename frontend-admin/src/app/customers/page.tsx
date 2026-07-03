'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import {
  fetchBookings, Booking,
  fetchRegisteredCustomers, updateRegisteredCustomer, deleteRegisteredCustomer, RegisteredCustomer
} from '@/lib/data';

interface Customer {
  name: string;
  avatar: string;
  email: string;
  trips: number;
  totalSpend: number;
  lastBooking: string;
  status: string;
}

function escapeCsvField(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export default function CustomersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [accounts, setAccounts] = useState<RegisteredCustomer[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountSearch, setAccountSearch] = useState('');

  const loadAccounts = async () => {
    try {
      const data = await fetchRegisteredCustomers();
      setAccounts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAccounts(false);
    }
  };

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
    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const q = accountSearch.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.phone || '').toLowerCase().includes(q)
    );
  }, [accounts, accountSearch]);

  const handleToggleActive = async (account: RegisteredCustomer) => {
    try {
      await updateRegisteredCustomer(account.id, { is_active: !account.is_active });
      await loadAccounts();
    } catch (e) {
      alert('Failed to update account status');
    }
  };

  const handleDeleteAccount = async (account: RegisteredCustomer) => {
    if (!confirm(`Delete the account for "${account.name}"? This cannot be undone.`)) return;
    try {
      await deleteRegisteredCustomer(account.id);
      await loadAccounts();
    } catch (e) {
      alert('Failed to delete account');
    }
  };

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

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(c => c.name.toLowerCase().includes(q));
  }, [customers, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['Name', 'Trips', 'Total Spend', 'Last Booking', 'Status'];
    const rows = filteredCustomers.map(c => [
      escapeCsvField(c.name),
      escapeCsvField(c.trips),
      escapeCsvField(c.totalSpend),
      escapeCsvField(c.lastBooking),
      escapeCsvField(c.status),
    ]);
    const csv = [headers.map(escapeCsvField).join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers…"
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleExportCsv}>Export CSV</button>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Customers</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Registered accounts and travelers from bookings.</p>
            </div>
          </div>

          {/* Registered accounts (real signed-up customers) */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:16}}>
            <div>
              <h4 style={{margin:0}}>Registered accounts</h4>
              <p className="sub" style={{margin:'4px 0 0', fontSize:13}}>
                {filteredAccounts.length} {filteredAccounts.length === 1 ? 'customer has' : 'customers have'} signed up via email or phone.
              </p>
            </div>
            <div className="admin-search" style={{width:260, padding:'6px 12px', fontSize:12}}>
              <Icon name="search" size={12}/>
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Search accounts…"
                style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', font: 'inherit' }}
              />
            </div>
          </div>

          <div className="panel" style={{marginBottom:32}}>
            {loadingAccounts ? (
              <div style={{padding: 48, textAlign: 'center', color: 'var(--muted)'}}>Loading accounts…</div>
            ) : accounts.length === 0 ? (
              <div style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
                <Icon name="users" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
                <p>No registered accounts yet. They'll appear here when customers sign up on the site.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{textAlign:'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>
                        No accounts match your search.
                      </td>
                    </tr>
                  ) : filteredAccounts.map(a => (
                    <tr key={a.id}>
                      <td style={{fontWeight:500}}>{a.name}</td>
                      <td style={{color:'var(--ink-2)'}}>{a.email || '—'}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{a.phone || '—'}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={'status ' + (a.is_active ? 'confirmed' : 'cancelled')}>
                          <span className="d"></span>{a.is_active ? 'active' : 'disabled'}
                        </span>
                      </td>
                      <td style={{textAlign:'right'}}>
                        <div style={{display:'inline-flex', gap:6}}>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 10px'}} onClick={() => handleToggleActive(a)}>
                            {a.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn btn-sm btn-ghost" style={{padding: '4px 8px', color:'var(--muted)'}} onClick={() => handleDeleteAccount(a)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{marginBottom:16}}>
            <h4 style={{margin:0}}>All travelers</h4>
            <p className="sub" style={{margin:'4px 0 0', fontSize:13}}>
              {filteredCustomers.length} unique travelers across {bookings.length} bookings (from enquiries, registered or not).
            </p>
          </div>

          {/* KPI summary cards */}
          <div className="kpis" style={{marginBottom: 24}}>
            <div className="kpi">
              <div className="lbl">Total Customers</div>
              <div className="v">{filteredCustomers.length}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Active Travelers</div>
              <div className="v">{filteredCustomers.filter(c => c.status === 'active').length}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Total Revenue</div>
              <div className="v">₹{filteredCustomers.reduce((s, c) => s + c.totalSpend, 0).toLocaleString()}</div>
            </div>
            <div className="kpi">
              <div className="lbl">Avg. Spend / Customer</div>
              <div className="v">
                ₹{filteredCustomers.length > 0 ? Math.round(filteredCustomers.reduce((s, c) => s + c.totalSpend, 0) / filteredCustomers.length).toLocaleString() : 0}
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
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>
                        No customers match your search.
                      </td>
                    </tr>
                  ) : filteredCustomers.map(c => (
                    <tr key={c.name}>
                      <td>
                        <div className="who">
                          <div className="ava" style={{ backgroundImage:`url(${c.avatar})` }}></div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td style={{fontFamily:'var(--mono)', fontSize:13}}>{c.trips}</td>
                      <td style={{fontFamily:'var(--serif)', fontSize:15}}>₹{c.totalSpend.toLocaleString()}</td>
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
