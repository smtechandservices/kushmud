'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { fetchSiteEffect, updateSiteEffect, SiteEffect } from '@/lib/data';

const EFFECT_OPTIONS: { value: SiteEffect; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No seasonal effect on the site.' },
  { value: 'snow', label: 'Snow', description: 'Falling snow over the offers section and footer.' },
  { value: 'rain', label: 'Rain', description: 'Falling rain streaks over the offers section and footer.' },
  { value: 'autumn', label: 'Autumn', description: 'Drifting autumn leaves over the offers section and footer.' },
  { value: 'independence_day', label: 'Independence Day', description: 'Rising kites and Indian flags over the offers section and footer.' },
];

export default function SiteEffectPage() {
  const [activeEffect, setActiveEffect] = useState<SiteEffect>('none');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSiteEffect()
      .then(s => setActiveEffect(s.active_effect))
      .catch(() => setError('Failed to load current effect.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await updateSiteEffect(activeEffect);
      setActiveEffect(updated.active_effect);
      setMessage('Saved. The live site will pick this up on next load.');
    } catch (e) {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <span></span>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Site Effect</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Choose the seasonal effect shown on the offers section and footer of the site.</p>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h4>Active effect</h4>
            </div>
            <div className="panel-body" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              {loading ? (
                <div style={{padding: 24, textAlign: 'center', color: 'var(--muted)'}}>Loading…</div>
              ) : (
                <>
                  <div className="effect-grid">
                    {EFFECT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`effect-card${activeEffect === opt.value ? ' active' : ''}`}
                        onClick={() => setActiveEffect(opt.value)}
                      >
                        <div className="effect-card-head">
                          <span className="effect-card-title">{opt.label}</span>
                          <span className="effect-card-radio" />
                        </div>
                        <span className="effect-card-desc">{opt.description}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 4}}>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    {message && <span style={{fontSize: 13, color: 'var(--forest)'}}>{message}</span>}
                    {error && <span style={{fontSize: 13, color: '#b8443a'}}>{error}</span>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
