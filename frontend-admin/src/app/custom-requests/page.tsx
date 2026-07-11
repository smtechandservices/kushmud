'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchCustomPackageRequests, updateCustomPackageRequestStatus, CustomPackageRequest } from '@/lib/data';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }) + ' IST';
}

function formatPax(r: CustomPackageRequest) {
  const parts = [`${r.pax_adults} adult${r.pax_adults !== 1 ? 's' : ''}`];
  if (r.pax_children) parts.push(`${r.pax_children} child${r.pax_children !== 1 ? 'ren' : ''}`);
  if (r.pax_infants) parts.push(`${r.pax_infants} infant${r.pax_infants !== 1 ? 's' : ''}`);
  return parts.join(', ');
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--line)'}}>
      <span style={{color: 'var(--muted)', fontSize: 13}}>{label}</span>
      <span style={{fontSize: 13, textAlign: 'right'}}>{value}</span>
    </div>
  );
}

interface RequestDetailsModalProps {
  request: CustomPackageRequest;
  isBusy: boolean;
  onClose: () => void;
  onSetStatus: (id: number, status: string) => void;
}

function RequestDetailsModal({ request: r, isBusy, onClose, onSetStatus }: RequestDetailsModalProps) {
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
        style={{background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: 32, maxWidth: 520, width: '100%', maxHeight: '85vh', overflowY: 'auto'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 6}}>Request #{r.id} · {r.traveler_type === 'reseller' ? 'Reseller' : 'Self / Individual'}</div>
        <h3 style={{fontSize: 22, marginBottom: 16}}>{r.customer_name || 'Unknown customer'}</h3>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DetailRow label="Status" value={<span className={'status ' + r.status}><span className="d"></span>{r.status}</span>} />
          {r.customer_email && <DetailRow label="Email" value={r.customer_email} />}
          {r.customer_phone && <DetailRow label="Phone" value={r.customer_phone} />}
          <DetailRow label="Region" value={r.region_name || r.region} />
          <DetailRow label="Destinations" value={(r.destination_names || []).join(', ') || '—'} />
          <DetailRow label="Things to do" value={(r.location_names || []).join(', ') || '—'} />
          <DetailRow label="Travelers" value={formatPax(r)} />
          {r.traveler_type === 'reseller' && r.requested_margin_percent && (
            <DetailRow label="Requested margin" value={`${r.requested_margin_percent}%`} />
          )}
          <DetailRow label="Travel date" value={r.travel_date ? new Date(r.travel_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not specified'} />
          <DetailRow label="Estimated trip length" value={r.estimated_days ? `${r.estimated_days} day${r.estimated_days !== 1 ? 's' : ''}` : 'Not specified'} />
          <DetailRow label="Submitted" value={formatDateTime(r.created_at)} />
          {r.hotel_preferences && (
            <div style={{padding: '10px 0'}}>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Hotel preferences</div>
              <div style={{fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{r.hotel_preferences}</div>
            </div>
          )}
          {r.travel_preferences && (
            <div style={{padding: '10px 0'}}>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Travel preferences</div>
              <div style={{fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{r.travel_preferences}</div>
            </div>
          )}
          {r.dietary_preferences && (
            <div style={{padding: '10px 0'}}>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Dietary preferences</div>
              <div style={{fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{r.dietary_preferences}</div>
            </div>
          )}
          {r.additional_notes && (
            <div style={{padding: '10px 0'}}>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Additional notes</div>
              <div style={{fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{r.additional_notes}</div>
            </div>
          )}
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24, gap: 10}}>
          <div style={{display: 'flex', gap: 10}}>
            {r.status !== 'contacted' && (
              <button className="btn btn-sm btn-primary" disabled={isBusy} onClick={() => onSetStatus(r.id, 'contacted')}>
                Mark contacted
              </button>
            )}
            {r.status !== 'closed' && (
              <button className="btn btn-sm btn-ghost" disabled={isBusy} onClick={() => onSetStatus(r.id, 'closed')}>
                Close Request
              </button>
            )}
            {r.status === 'closed' && (
              <button className="btn btn-sm btn-ghost" disabled={isBusy} onClick={() => onSetStatus(r.id, 'new')}>
                Reopen Request
              </button>
            )}
            <button className="btn btn-sm btn-ghost" onClick={onClose}>Close panel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<CustomPackageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<CustomPackageRequest | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchCustomPackageRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRequests = requests.filter(r => {
    if (typeFilter !== 'All' && r.traveler_type !== typeFilter) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.customer_name || '').toLowerCase().includes(q) ||
      (r.customer_email || '').toLowerCase().includes(q) ||
      (r.region_name || r.region).toLowerCase().includes(q) ||
      (r.destination_names || []).some(d => d.toLowerCase().includes(q))
    );
  });

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setIsBusy(true);
    try {
      await updateCustomPackageRequestStatus(id, newStatus);
      await loadData();
      setSelected(null);
    } catch (e) {
      alert('Failed to update request status');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div className="admin-search">
              <Icon name="search" size={14}/>
              <input
                type="text"
                placeholder="Search by customer, email, or destination…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              style={{
                padding:'8px 14px', background:'#f4ede0', border:'none', borderRadius:4,
                fontSize:13, color:'var(--muted)', fontFamily:'var(--sans)', outline:'none'
              }}
            >
              <option value="All">All traveler types</option>
              <option value="self">Self / Individual</option>
              <option value="reseller">Reseller</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding:'8px 14px', background:'#f4ede0', border:'none', borderRadius:4,
                fontSize:13, color:'var(--muted)', fontFamily:'var(--sans)', outline:'none'
              }}
            >
              <option value="All">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Custom package requests</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {filteredRequests.length} of {requests.length} request{requests.length !== 1 ? 's' : ''}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>Loading custom package requests...</div>
            ) : (
              <div style={{overflowX: 'auto'}}>
              <table className="dtable" style={{whiteSpace: 'nowrap'}}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Region</th>
                    <th>Destinations</th>
                    <th>Type</th>
                    <th style={{textAlign:'center'}}>Travelers</th>
                    <th style={{textAlign:'center'}}>Margin</th>
                    <th style={{textAlign:'center'}}>Travel date</th>
                    <th style={{textAlign:'center'}}>Days</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(r => (
                    <tr key={r.id}>
                      <td>
                        <span style={{cursor:'pointer'}} onClick={() => setSelected(r)}>{r.customer_name || 'Unknown'}</span>
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{r.region_name || r.region}</td>
                      <td style={{color:'var(--ink-2)'}}>{(r.destination_names || []).join(', ') || '—'}</td>
                      <td style={{color:'var(--ink-2)'}}>{r.traveler_type === 'reseller' ? 'Reseller' : 'Self'}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{r.pax_adults + r.pax_children + r.pax_infants}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{r.traveler_type === 'reseller' && r.requested_margin_percent ? `${r.requested_margin_percent}%` : '—'}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{r.travel_date ? new Date(r.travel_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{r.estimated_days ?? '—'}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{formatDateTime(r.created_at)}</td>
                      <td>
                        <span className={'status ' + r.status}><span className="d"></span>{r.status}</span>
                      </td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setSelected(r)}>View</button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={11} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>
                        {requests.length === 0 ? 'No custom package requests yet.' : 'No requests match your search or filter.'}
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

      {selected && (
        <RequestDetailsModal
          request={selected}
          isBusy={isBusy}
          onClose={() => setSelected(null)}
          onSetStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
