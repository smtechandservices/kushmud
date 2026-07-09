'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchB2BInquiries, updateB2BInquiryStatus, B2BInquiry } from '@/lib/data';

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

interface InquiryDetailsModalProps {
  inquiry: B2BInquiry;
  isBusy: boolean;
  onClose: () => void;
  onSetStatus: (id: number, status: string) => void;
}

function InquiryDetailsModal({ inquiry, isBusy, onClose, onSetStatus }: InquiryDetailsModalProps) {
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
        style={{background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 8, padding: 32, maxWidth: 480, width: '100%'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 6}}>{inquiry.inquiry_type}</div>
        <h3 style={{fontSize: 22, marginBottom: 16}}>{inquiry.organization}</h3>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DetailRow label="Status" value={<span className={'status ' + inquiry.status}><span className="d"></span>{inquiry.status}</span>} />
          <DetailRow label="Contact" value={`${inquiry.first_name} ${inquiry.last_name}`} />
          <DetailRow label="Email" value={inquiry.email} />
          {inquiry.phone && <DetailRow label="Phone" value={inquiry.phone} />}
          {inquiry.group_size && <DetailRow label="Group size" value={inquiry.group_size} />}
          {inquiry.requested_margin_percent && <DetailRow label="Requested margin" value={`${inquiry.requested_margin_percent}%`} />}
          <DetailRow label="Submitted" value={formatDateTime(inquiry.created_at)} />
          <div style={{padding: '10px 0'}}>
            <div style={{color: 'var(--muted)', fontSize: 13, marginBottom: 4}}>Message</div>
            <div style={{fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{inquiry.message}</div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24, gap: 10}}>
          <div style={{display: 'flex', gap: 10}}>
            {inquiry.status !== 'contacted' && (
              <button
                className="btn btn-sm btn-primary"
                disabled={isBusy}
                onClick={() => onSetStatus(inquiry.id, 'contacted')}
              >
                Mark contacted
              </button>
            )}
            {inquiry.status !== 'closed' && (
              <button
                className="btn btn-sm btn-ghost"
                disabled={isBusy}
                onClick={() => onSetStatus(inquiry.id, 'closed')}
              >
                Close Request
              </button>
            )}
            {inquiry.status === 'closed' && (
              <button
                className="btn btn-sm btn-ghost"
                disabled={isBusy}
                onClick={() => onSetStatus(inquiry.id, 'new')}
              >
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

export default function B2BInquiriesPage() {
  const [inquiries, setInquiries] = useState<B2BInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<B2BInquiry | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchB2BInquiries();
      setInquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const typeOptions = Array.from(new Set(inquiries.map(i => i.inquiry_type))).sort();

  const filteredInquiries = inquiries.filter(i => {
    if (typeFilter !== 'All' && i.inquiry_type !== typeFilter) return false;
    if (statusFilter !== 'All' && i.status !== statusFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      i.organization.toLowerCase().includes(q) ||
      i.first_name.toLowerCase().includes(q) ||
      i.last_name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q)
    );
  });

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setIsBusy(true);
    try {
      await updateB2BInquiryStatus(id, newStatus);
      await loadData();
      setSelected(null);
    } catch (e) {
      alert('Failed to update inquiry status');
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
                placeholder="Search by organization, contact, or email…"
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
              <option value="All">All types</option>
              {typeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
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
              <h2>B2B requests</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>
                {filteredInquiries.length} of {inquiries.length} inquir{inquiries.length !== 1 ? 'ies' : 'y'}.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>Refresh</button>
          </div>

          <div className="panel">
            {loading ? (
              <div style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>Loading B2B requests...</div>
            ) : (
              <div style={{overflowX: 'auto'}}>
              <table className="dtable" style={{whiteSpace: 'nowrap'}}>
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th style={{textAlign:'center'}}>Group size</th>
                    <th style={{textAlign:'center'}}>Margin</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map(i => (
                    <tr key={i.id}>
                      <td>
                        <span style={{cursor:'pointer'}} onClick={() => setSelected(i)}>{i.organization}</span>
                      </td>
                      <td style={{color:'var(--ink-2)'}}>{i.first_name} {i.last_name}</td>
                      <td style={{color:'var(--ink-2)'}}>{i.email}</td>
                      <td style={{color:'var(--ink-2)'}}>{i.inquiry_type}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{i.group_size || '—'}</td>
                      <td style={{textAlign:'center', color:'var(--ink-2)', fontFamily:'var(--mono)', fontSize:12}}>{i.requested_margin_percent ? `${i.requested_margin_percent}%` : '—'}</td>
                      <td style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)'}}>{formatDateTime(i.created_at)}</td>
                      <td>
                        <span className={'status ' + i.status}><span className="d"></span>{i.status}</span>
                      </td>
                      <td style={{textAlign:'right'}}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setSelected(i)}>View</button>
                      </td>
                    </tr>
                  ))}
                  {filteredInquiries.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{textAlign: 'center', padding: 24, color: 'var(--muted)'}}>
                        {inquiries.length === 0 ? 'No B2B requests yet.' : 'No requests match your search or filter.'}
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
        <InquiryDetailsModal
          inquiry={selected}
          isBusy={isBusy}
          onClose={() => setSelected(null)}
          onSetStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
