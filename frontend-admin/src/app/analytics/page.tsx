'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchAnalytics } from '@/lib/data';

interface AreaChartProps {
  series: number[];
  labels: string[];
  color?: string;
}

function AreaChart({ series, labels, color = 'var(--clay)' }: AreaChartProps) {
  const max = Math.max(1, ...series);
  const w = 800, h = 220;
  const step = w / Math.max(1, series.length - 1);
  const path = series.map((v, i) => {
    const x = i * step;
    const y = h - (v / max) * h;
    return (i === 0 ? 'M' : 'L') + x + ',' + y.toFixed(1);
  }).join(' ');
  const area = path + ` L${w},${h} L0,${h} Z`;
  return (
    <div style={{position: 'relative'}}>
      <svg viewBox={`0 0 ${w} ${h + 30}`} preserveAspectRatio="none" width="100%" height={250}>
        {[0, 0.25, 0.5, 0.75, 1].map(f =>
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--line)" strokeDasharray="2 4"/>
        )}
        <path d={area} fill={color} opacity={0.08}/>
        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"/>
        {series.map((v, i) => {
          const x = i * step;
          const y = h - (v / max) * h;
          return <circle key={i} cx={x} cy={y} r={i === series.length - 1 ? 5 : 3} fill={i === series.length - 1 ? color : 'var(--paper)'} stroke={color} strokeWidth={1.5}/>;
        })}
        {labels.map((l, i) =>
          <text key={l} x={i * step} y={h + 22} fontSize="10" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fill="#756e63" letterSpacing="0.5">{l.toUpperCase()}</text>
        )}
      </svg>
    </div>
  );
}

interface BarListProps {
  rows: { label: string; value: number; color?: string }[];
  formatValue?: (v: number) => string;
}

function BarList({ rows, formatValue = (v) => String(v) }: BarListProps) {
  const max = Math.max(1, ...rows.map(r => r.value));
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
      {rows.length === 0 ? (
        <div style={{textAlign: 'center', color: 'var(--muted)', padding: 24}}>No data yet.</div>
      ) : rows.map(r => (
        <div key={r.label}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6}}>
            <span style={{color: 'var(--ink-2)'}}>{r.label}</span>
            <span style={{fontFamily: 'var(--mono)', color: 'var(--muted)'}}>{formatValue(r.value)}</span>
          </div>
          <div style={{height: 6, background: 'var(--line)', borderRadius: 3, overflow: 'hidden'}}>
            <div style={{
              height: '100%',
              width: `${(r.value / max) * 100}%`,
              background: r.color || 'var(--clay)',
              borderRadius: 3,
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#1f7a4d',
  pending: '#c79a4a',
  cancelled: '#b8443a',
};

const formatCurrency = (v: number) => v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`;

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalytics();
      setData(result);
    } catch (e) {
      setError('Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = data?.kpis ?? null;
  const statusRows = (data?.status_breakdown ?? []).map((s: any) => ({
    label: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
    color: STATUS_COLORS[s.status],
  }));
  const regionRows = (data?.revenue_by_region ?? []).map((r: any) => ({ label: r.region, value: r.revenue }));
  const typeRows = (data?.revenue_by_type ?? []).map((t: any) => ({ label: t.type, value: t.revenue }));
  const topDestinations = data?.top_destinations ?? [];

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search reports…</span>
          </div>
        </div>

        <div className="admin-content">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24}}>
            <div>
              <h2>Analytics</h2>
              <p className="sub" style={{margin: '6px 0 0'}}>Detailed insights on revenue and engagement.</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={load}>Refresh</button>
          </div>

          {loading ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              Loading analytics…
            </div>
          ) : error ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              <Icon name="chart" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="kpis">
                <div className="kpi">
                  <div className="lbl">Total revenue</div>
                  <div className="v">{formatCurrency(kpis.total_revenue)}</div>
                </div>
                <div className="kpi">
                  <div className="lbl">Total bookings</div>
                  <div className="v">{kpis.total_bookings}</div>
                </div>
                <div className="kpi">
                  <div className="lbl">Avg. booking value</div>
                  <div className="v">{formatCurrency(kpis.avg_booking_value)}</div>
                </div>
                <div className="kpi">
                  <div className="lbl">Conversion rate</div>
                  <div className="v">{kpis.conversion_rate}%</div>
                </div>
              </div>

              <div className="admin-grid">
                <div className="panel">
                  <div className="panel-head">
                    <h4>Revenue trend</h4>
                    <span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Last 6 months</span>
                  </div>
                  <div className="panel-body" style={{paddingBottom: 18}}>
                    <AreaChart series={data.revenue_trend} labels={data.labels} />
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <h4>Bookings by status</h4>
                  </div>
                  <div className="panel-body">
                    <BarList rows={statusRows} />
                  </div>
                </div>
              </div>

              <div style={{height: 20}}></div>

              <div className="admin-grid">
                <div className="panel">
                  <div className="panel-head">
                    <h4>New customers</h4>
                    <span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Last 6 months</span>
                  </div>
                  <div className="panel-body" style={{paddingBottom: 18}}>
                    <AreaChart series={data.customer_growth} labels={data.labels} color="var(--forest)" />
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <h4>Top destinations</h4>
                    <span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase'}}>By bookings</span>
                  </div>
                  <div className="panel-body" style={{padding: 0}}>
                    {topDestinations.length === 0 ? (
                      <div style={{padding: 32, textAlign: 'center', color: 'var(--muted)'}}>No bookings yet.</div>
                    ) : topDestinations.map((d: any, i: number) => (
                      <div key={d.destination} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 22px',
                        borderBottom: i < topDestinations.length - 1 ? '1px solid var(--line)' : 0,
                      }}>
                        <span style={{fontSize: 13.5}}>{d.destination}</span>
                        <span style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase'}}>{d.bookings} bookings</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{height: 20}}></div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div className="panel">
                  <div className="panel-head">
                    <h4>Revenue by region</h4>
                  </div>
                  <div className="panel-body">
                    <BarList rows={regionRows} formatValue={formatCurrency} />
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <h4>Revenue by trip type</h4>
                  </div>
                  <div className="panel-body">
                    <BarList rows={typeRows} formatValue={formatCurrency} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
