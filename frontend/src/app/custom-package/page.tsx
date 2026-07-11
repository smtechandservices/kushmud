'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';
import {
  isCustomerLoggedIn, fetchRegions, fetchDestinations, createCustomPackageRequest,
  Region, Destination,
} from '@/lib/data';

const STEP_LABELS = ['Region', 'Destinations', 'Things to do', 'Travelers', 'Preferences'];

export default function CustomPackagePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [regions, setRegions] = useState<Region[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [step, setStep] = useState(1);

  const [region, setRegion] = useState<string | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);

  const [travelerType, setTravelerType] = useState<'self' | 'reseller'>('self');
  const [marginPercent, setMarginPercent] = useState('');
  const [paxAdults, setPaxAdults] = useState<number | ''>(1);
  const [paxChildren, setPaxChildren] = useState<number | ''>(0);
  const [paxInfants, setPaxInfants] = useState<number | ''>(0);
  const [estimatedDays, setEstimatedDays] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const [hotelPreferences, setHotelPreferences] = useState('');
  const [travelPreferences, setTravelPreferences] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      router.replace('/login?redirect=/custom-package');
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (isCheckingAuth) return;
    Promise.all([fetchRegions(), fetchDestinations()])
      .then(([r, d]) => { setRegions(r); setDestinations(d); })
      .catch(console.error)
      .finally(() => setLoadingData(false));
  }, [isCheckingAuth]);

  const destinationsInRegion = destinations.filter(d => d.region === region);
  const chosenDestinations = destinations.filter(d => selectedDestinations.includes(d.name));

  const toggleDestination = (name: string) => {
    setSelectedDestinations(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      const stillValidLocationIds = destinations
        .filter(d => next.includes(d.name))
        .flatMap(d => (d.locations || []).map(l => l.id));
      setSelectedLocationIds(ids => ids.filter(id => stillValidLocationIds.includes(id)));
      return next;
    });
  };

  const toggleLocation = (id: number) => {
    setSelectedLocationIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const canContinue = () => {
    if (step === 1) return !!region;
    if (step === 2) return selectedDestinations.length > 0;
    if (step === 3) return true;
    if (step === 4) {
      if (estimatedDays && Number(estimatedDays) < 1) return false;
      if (travelerType === 'reseller' && !marginPercent) return false;
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!canContinue()) {
      setError('Please fill out the required fields before continuing.');
      return;
    }
    setError('');
    setStep(s => Math.min(5, s + 1));
  };

  const goBack = () => {
    setError('');
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await createCustomPackageRequest({
        region: region as string,
        destinations: selectedDestinations,
        locations: selectedLocationIds,
        traveler_type: travelerType,
        requested_margin_percent: travelerType === 'reseller' ? marginPercent : undefined,
        pax_adults: paxAdults === '' ? 1 : paxAdults,
        pax_children: paxChildren === '' ? 0 : paxChildren,
        pax_infants: paxInfants === '' ? 0 : paxInfants,
        estimated_days: estimatedDays ? Number(estimatedDays) : undefined,
        travel_date: travelDate || undefined,
        hotel_preferences: hotelPreferences || undefined,
        travel_preferences: travelPreferences || undefined,
        dietary_preferences: dietaryPreferences || undefined,
        additional_notes: additionalNotes || undefined,
      });
      setIsSuccess(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setIsSuccess(false);
    setStep(1);
    setRegion(null);
    setSelectedDestinations([]);
    setSelectedLocationIds([]);
    setTravelerType('self');
    setMarginPercent('');
    setPaxAdults(1);
    setPaxChildren(0);
    setPaxInfants(0);
    setEstimatedDays('');
    setTravelDate('');
    setHotelPreferences('');
    setTravelPreferences('');
    setDietaryPreferences('');
    setAdditionalNotes('');
  };

  if (isCheckingAuth || loadingData) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: '100px 0', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Build a Trip</span></div>
          <h1>Design your own<br/><em style={{fontStyle:'italic'}}>itinerary.</em></h1>
          <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>Pick your region, your destinations, and the things you want to do — we'll turn it into a quote.</p>
        </div>
      </div>

      <div className="container page-content-sm">
        {isSuccess ? (
          <div style={{
            background: 'rgba(235, 110, 75, 0.05)',
            border: '1px solid rgba(235, 110, 75, 0.2)',
            borderRadius: 8,
            padding: 40,
            textAlign: 'center',
          }}>
            <h3 style={{color: 'var(--clay)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
              <Icon name="check" size={22} stroke={3} /> Request sent
            </h3>
            <p style={{color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 auto 24px', maxWidth: 440}}>
              Thanks for building your trip with us. A planner will review your selections and follow up with a tailored quote soon.
            </p>
            <button onClick={resetWizard} className="btn btn-ghost" style={{marginRight: 12}}>Build another</button>
            <button onClick={() => router.push('/')} className="btn btn-primary">Back to home</button>
          </div>
        ) : (
          <>
            <div className="steps">
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const cls = n < step ? 'step done' : n === step ? 'step active' : 'step';
                return (
                  <div key={label} className={cls}>
                    <span className="n">{n < step ? <Icon name="check" size={13} stroke={2.5}/> : n}</span>
                    <span className="lbl">{label}</span>
                  </div>
                );
              })}
            </div>

            {/* ── Step 1: Region ── */}
            {step === 1 && (
              <div>
                <span className="eyebrow">— Step 1</span>
                <h2 style={{marginTop: 10, marginBottom: 24}}>Which region are you headed to?</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12}}>
                  {regions.map(r => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => { setRegion(r.name); setSelectedDestinations([]); setSelectedLocationIds([]); }}
                      className="btn"
                      style={{
                        padding: '20px 16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                        border: region === r.name ? '2px solid var(--clay)' : '1px solid var(--line)',
                        background: region === r.name ? 'rgba(235,110,75,0.06)' : 'var(--paper)',
                      }}
                    >
                      <Icon name="globe" size={16} style={{color: 'var(--forest)', flexShrink: 0}}/>
                      <span>{r.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Destinations ── */}
            {step === 2 && (
              <div>
                <span className="eyebrow">— Step 2</span>
                <h2 style={{marginTop: 10, marginBottom: 8}}>Pick one or more destinations in {region}</h2>
                <p style={{color: 'var(--muted)', fontSize: 13, marginBottom: 24}}>You can select more than one — we'll build a multi-stop itinerary.</p>
                {destinationsInRegion.length === 0 ? (
                  <p style={{color: 'var(--muted)'}}>No destinations found in this region yet.</p>
                ) : (
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12}}>
                    {destinationsInRegion.map(d => {
                      const active = selectedDestinations.includes(d.name);
                      return (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => toggleDestination(d.name)}
                          className="btn"
                          style={{
                            padding: 0, textAlign: 'left', overflow: 'hidden', height: 140, position: 'relative',
                            border: active ? '2px solid var(--clay)' : '1px solid var(--line)',
                            backgroundImage: `url(${d.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            filter: active ? 'none' : 'grayscale(1) brightness(0.95)',
                            boxShadow: active ? '0 6px 16px rgba(235,110,75,0.18)' : 'none',
                            transition: 'filter .3s ease, box-shadow .2s ease',
                          }}
                        >
                          <div style={{position: 'absolute', inset: 0, background: active ? 'rgba(28,25,22,0.35)' : 'rgba(28,25,22,0.5)'}} />
                          {active && (
                            <span style={{position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%', background: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <Icon name="check" size={13} stroke={2.5} style={{color: 'white'}}/>
                            </span>
                          )}
                          <span style={{position: 'absolute', bottom: 10, left: 12, color: 'white', fontWeight: 500}}>{d.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Step 3: Things to do ── */}
            {step === 3 && (
              <div>
                <span className="eyebrow">— Step 3</span>
                <h2 style={{marginTop: 10, marginBottom: 8}}>What do you want to do?</h2>
                <p style={{color: 'var(--muted)', fontSize: 13, marginBottom: 24}}>Optional — pick anything that stands out, across your selected destinations.</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
                  {chosenDestinations.map(d => (
                    <div key={d.name}>
                      <h4 style={{fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8}}>
                        <Icon name="pin" size={14} style={{color: 'var(--clay)'}}/> {d.name}
                      </h4>
                      {(d.locations || []).length === 0 ? (
                        <p style={{color: 'var(--muted)', fontSize: 13}}>No curated things-to-do yet for {d.name}.</p>
                      ) : (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14}}>
                          {(d.locations || []).map(loc => {
                            const active = selectedLocationIds.includes(loc.id);
                            return (
                              <label
                                key={loc.id}
                                style={{
                                  display: 'flex', flexDirection: 'column', cursor: 'pointer',
                                  border: active ? '2px solid var(--clay)' : '1px solid var(--line)',
                                  borderRadius: 8, overflow: 'hidden',
                                  background: 'var(--paper)',
                                  boxShadow: active ? '0 6px 16px rgba(235,110,75,0.18)' : 'none',
                                  transition: 'border-color .2s ease, box-shadow .2s ease, transform .2s ease',
                                  transform: active ? 'translateY(-2px)' : 'none',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={active}
                                  onChange={() => toggleLocation(loc.id)}
                                  style={{position: 'absolute', opacity: 0, width: 0, height: 0}}
                                />
                                <span
                                  style={{
                                    position: 'relative', width: '100%', aspectRatio: '4 / 3',
                                    backgroundImage: loc.img ? `url(${loc.img})` : undefined,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    backgroundColor: 'var(--sand-2)',
                                    filter: active ? 'none' : 'grayscale(1) brightness(0.95)',
                                    opacity: active ? 1 : 0.7,
                                    transition: 'filter .3s ease, opacity .3s ease',
                                  }}
                                >
                                  <span
                                    style={{
                                      position: 'absolute', top: 8, right: 8,
                                      width: 22, height: 22, borderRadius: '50%',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      background: active ? 'var(--clay)' : 'rgba(255,255,255,0.85)',
                                      border: active ? 'none' : '1px solid rgba(0,0,0,0.15)',
                                      transition: 'background .2s ease',
                                    }}
                                  >
                                    {active && <Icon name="check" size={13} style={{color: 'white'}}/>}
                                  </span>
                                </span>
                                <span style={{padding: '10px 12px 12px', opacity: active ? 1 : 0.75, transition: 'opacity .3s ease'}}>
                                  <span style={{display: 'block', fontSize: 14, fontWeight: 500}}>{loc.name}</span>
                                  {loc.description && <span style={{display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4}}>{loc.description}</span>}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 4: Travelers ── */}
            {step === 4 && (
              <div>
                <span className="eyebrow">— Step 4</span>
                <h2 style={{marginTop: 10, marginBottom: 24}}>Who's traveling?</h2>

                <div className="cp-type-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24}}>
                  <button
                    type="button"
                    onClick={() => setTravelerType('self')}
                    className="btn"
                    style={{
                      padding: '18px 16px', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
                      border: travelerType === 'self' ? '2px solid var(--clay)' : '1px solid var(--line)',
                      background: travelerType === 'self' ? 'rgba(235,110,75,0.06)' : 'var(--paper)',
                    }}
                  >
                    <Icon name="users" size={16} style={{color: 'var(--forest)', flexShrink: 0}}/>
                    <span>For myself / my group</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTravelerType('reseller')}
                    className="btn"
                    style={{
                      padding: '18px 16px', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
                      border: travelerType === 'reseller' ? '2px solid var(--clay)' : '1px solid var(--line)',
                      background: travelerType === 'reseller' ? 'rgba(235,110,75,0.06)' : 'var(--paper)',
                    }}
                  >
                    <Icon name="briefcase" size={16} style={{color: 'var(--forest)', flexShrink: 0}}/>
                    <span>I'm reselling this trip</span>
                  </button>
                </div>

                {travelerType === 'reseller' && (
                  <div className="field-group" style={{marginBottom: 20, maxWidth: 260}}>
                    <label>Desired margin %</label>
                    <input
                      type="number" min="0" max="100" step="0.5"
                      placeholder="e.g. 15"
                      value={marginPercent}
                      onChange={e => setMarginPercent(e.target.value)}
                    />
                  </div>
                )}

                <div className="cp-pax-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20}}>
                  <div className="field-group">
                    <label>Adults</label>
                    <input
                      type="number" min="1" value={paxAdults}
                      onChange={e => setPaxAdults(e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => setPaxAdults(prev => Math.max(1, Number(prev) || 0))}
                    />
                  </div>
                  <div className="field-group">
                    <label>Children</label>
                    <input
                      type="number" min="0" value={paxChildren}
                      onChange={e => setPaxChildren(e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => setPaxChildren(prev => Math.max(0, Number(prev) || 0))}
                    />
                  </div>
                  <div className="field-group">
                    <label>Infants</label>
                    <input
                      type="number" min="0" value={paxInfants}
                      onChange={e => setPaxInfants(e.target.value === '' ? '' : Number(e.target.value))}
                      onBlur={() => setPaxInfants(prev => Math.max(0, Number(prev) || 0))}
                    />
                  </div>
                </div>

                <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
                  <div className="field-group" style={{maxWidth: 260}}>
                    <label>Travel date (optional)</label>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                    />
                  </div>
                  <div className="field-group" style={{maxWidth: 260}}>
                    <label>Estimated days needed (optional)</label>
                    <input
                      type="number" min="1"
                      placeholder="e.g. 7"
                      value={estimatedDays}
                      onChange={e => setEstimatedDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 5: Preferences & review ── */}
            {step === 5 && (
              <div>
                <span className="eyebrow">— Step 5</span>
                <h2 style={{marginTop: 10, marginBottom: 24}}>Anything else we should know?</h2>

                <div style={{display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40}}>
                  <div className="field-group">
                    <label>Hotel preferences</label>
                    <textarea
                      placeholder="Star rating, room type, boutique vs. chain, accessibility needs…"
                      style={{minHeight: 80, resize: 'vertical'}}
                      value={hotelPreferences}
                      onChange={e => setHotelPreferences(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Travel preferences</label>
                    <textarea
                      placeholder="Pace, private guide vs. group tours, occasion, flights needed…"
                      style={{minHeight: 80, resize: 'vertical'}}
                      value={travelPreferences}
                      onChange={e => setTravelPreferences(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Dietary preferences</label>
                    <textarea
                      placeholder="Vegetarian, vegan, halal, allergies…"
                      style={{minHeight: 60, resize: 'vertical'}}
                      value={dietaryPreferences}
                      onChange={e => setDietaryPreferences(e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Anything else</label>
                    <textarea
                      placeholder="Budget range, add-ons like insurance or visa assistance…"
                      style={{minHeight: 60, resize: 'vertical'}}
                      value={additionalNotes}
                      onChange={e => setAdditionalNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{border: '1px solid var(--line)', borderRadius: 8, padding: 24, marginBottom: 32}}>
                  <h4 style={{fontSize: 14, marginBottom: 16, fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)'}}>Trip summary</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14}}>
                    <div><strong>Region:</strong> {region}</div>
                    <div><strong>Destinations:</strong> {selectedDestinations.join(', ')}</div>
                    <div><strong>Things to do:</strong> {selectedLocationIds.length > 0 ? `${selectedLocationIds.length} selected` : 'None selected'}</div>
                    <div><strong>Traveling as:</strong> {travelerType === 'reseller' ? `Reseller (${marginPercent || 0}% margin)` : 'Self / individual'}</div>
                    <div><strong>Travelers:</strong> {paxAdults} adult{paxAdults !== 1 ? 's' : ''}{paxChildren ? `, ${paxChildren} children` : ''}{paxInfants ? `, ${paxInfants} infants` : ''}</div>
                    <div><strong>Travel date:</strong> {travelDate ? new Date(travelDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not specified'}</div>
                    <div><strong>Estimated trip length:</strong> {estimatedDays ? `${estimatedDays} days` : 'Not specified'}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p style={{color: 'var(--clay)', fontSize: 13, marginTop: 16}}>{error}</p>
            )}

            <div className="cp-nav-row" style={{display: 'flex', justifyContent: 'space-between', marginTop: 32}}>
              <button type="button" className="btn btn-ghost" onClick={goBack} disabled={step === 1}>
                Back
              </button>
              {step < 5 ? (
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Continue
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit request'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
