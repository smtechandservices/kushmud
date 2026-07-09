'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';
import { createB2BInquiry } from '@/lib/data';

const INQUIRY_TYPES = [
  'Corporate Custom Travel',
  'Sports Travel — Team',
  'Sports Travel — Individual',
  'Travel Agency — Bulk Reseller',
  'Other',
];

const TRAVEL_AGENCY_TYPE = 'Travel Agency — Bulk Reseller';

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'yahoo.co.in', 'yahoo.co.uk',
  'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'hotmail.co.in', 'live.com', 'msn.com',
  'aol.com', 'icloud.com', 'me.com', 'protonmail.com', 'proton.me', 'mail.com', 'gmx.com',
  'yandex.com', 'zoho.com', 'rediffmail.com', 'inbox.com',
]);

function isProfessionalEmail(email: string): boolean {
  const domain = email.trim().split('@')[1]?.toLowerCase();
  return !!domain && !FREE_EMAIL_DOMAINS.has(domain);
}

const pillars = [
  {
    icon: 'briefcase',
    tag: 'Corporate',
    title: 'Corporate custom travel',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop',
    desc: "Offsites, incentive trips, client entertainment and leadership retreats, planned around your calendar and budget rather than a template.",
    features: [
      'Dedicated account manager for every booking',
      'Consolidated, itemized invoicing for finance teams',
      'Flexible group sizes, from a 6-person leadership trip to a 100-person offsite',
      'Duty-of-care support and 24/7 on-trip assistance',
    ],
  },
  {
    icon: 'trophy',
    tag: 'Sports',
    title: 'Sports travel',
    img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&auto=format&fit=crop',
    desc: 'Logistics for teams heading to tournaments and individuals training or competing abroad fixtures, transfers and recovery time all accounted for.',
    features: [
      'Team travel for squads, coaching staff and equipment',
      'Individual athlete itineraries built around training and competition schedules',
      'Venue-aware routing to minimize travel fatigue before events',
      'Group rates on accommodation, transfers and meals',
    ],
  },
  {
    icon: 'percent',
    tag: 'Travel agencies',
    title: 'Bulk packages, reseller margins',
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    desc: "Wholesale access to our package catalog so your agency can list, mark up and sell under your own portal or brand, no separate contract per destination.",
    features: [
      'Bulk-rate packages with a negotiated margin % built in for your agency',
      'White-label itineraries you can publish on your own booking portal',
      'Volume tiers that improve margin as your booking volume grows',
      'A single reseller agreement covering the full package catalog',
    ],
  },
];

const steps = [
  { num: '01', title: 'Tell us the brief', desc: 'Share your dates, group size and goals through the form below.' },
  { num: '02', title: 'Get a tailored plan', desc: "A B2B planner puts together an itinerary and quote, usually within 48 hours." },
  { num: '03', title: 'We run it end to end', desc: 'From bookings to on-the-ground support, one team stays accountable throughout.' },
];

function B2BContent() {
  const searchParams = useSearchParams();
  const [orgName, setOrgName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [groupSize, setGroupSize] = useState('');
  const [marginPercent, setMarginPercent] = useState('');
  const [message, setMessage] = useState('');

  const isTravelAgency = inquiryType === TRAVEL_AGENCY_TYPE;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && INQUIRY_TYPES.includes(type)) {
      setInquiryType(type);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !firstName || !lastName || !email || !phone || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!isProfessionalEmail(email)) {
      alert('Please use your professional/work email address rather than a personal one.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createB2BInquiry({
        organization: orgName,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        inquiry_type: inquiryType,
        group_size: groupSize || undefined,
        requested_margin_percent: isTravelAgency ? (marginPercent || undefined) : undefined,
        message,
      });
      setIsSuccess(true);
      setOrgName('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setGroupSize('');
      setMarginPercent('');
      setMessage('');
    } catch (e) {
      console.error(e);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>B2B</span></div>
          <h1>Travel, organized<br/><em style={{fontStyle:'italic'}}>for teams.</em></h1>
        </div>
      </div>

      {/* ── Intro ── */}
      <div className="container page-content-sm">
        <p style={{fontSize: 20, lineHeight: 1.5, fontFamily: 'var(--serif)', color: 'var(--ink)', maxWidth: 760}}>
          Whether it's a corporate offsite, a client trip or a team heading to a tournament, we handle the logistics so your people can focus on why they're actually traveling.
        </p>
      </div>

      {/* ── Pillars ── */}
      <div className="container" style={{paddingBottom: 96}}>
        <div className="rgrid" style={{'--cols': 'repeat(3, 1fr)', '--gap': '32px'} as React.CSSProperties}>
          {pillars.map((p) => (
            <div key={p.title} style={{border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden'}}>
              <div style={{aspectRatio: '3 / 1', overflow: 'hidden'}}>
                <img src={p.img} alt={p.title} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}/>
              </div>
              <div style={{padding: 40}}>
                <div style={{width: 48, height: 48, borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24}}>
                  <Icon name={p.icon} size={20} style={{color: 'var(--forest)'}}/>
                </div>
                <span className="eyebrow">— {p.tag}</span>
                <h3 style={{marginTop: 12, marginBottom: 12}}>{p.title}</h3>
                <p style={{fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 24}}>{p.desc}</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  {p.features.map((f) => (
                    <div key={f} style={{display: 'flex', gap: 10, alignItems: 'flex-start'}}>
                      <Icon name="check" size={14} stroke={2.5} style={{color: 'var(--clay)', marginTop: 3, flexShrink: 0}}/>
                      <span style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{background: 'var(--sand)', borderTop: '1px solid var(--line)', padding: '96px 0'}}>
        <div className="container">
          <span className="eyebrow">— How it works</span>
          <div className="rgrid" style={{'--cols': 'repeat(3, 1fr)', '--gap': '48px', marginTop: 40} as React.CSSProperties}>
            {steps.map((s) => (
              <div key={s.num}>
                <div style={{fontFamily: 'var(--serif)', fontSize: 32, letterSpacing: '-0.02em', color: 'var(--clay)', marginBottom: 16}}>{s.num}</div>
                <h4>{s.title}</h4>
                <p style={{marginTop: 12, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Inquiry form ── */}
      <div id="quote" className="container page-content" style={{scrollMarginTop: 96}}>
        <div className="rgrid" style={{'--cols': '1.2fr 1fr', '--gap': '100px'} as React.CSSProperties}>
          <div>
            <span className="eyebrow">— Get a quote</span>
            <h2 style={{marginTop: 14, marginBottom: 32}}>Tell us about<br/><em style={{fontStyle:'italic'}}>your trip.</em></h2>

            {isSuccess ? (
              <div style={{
                background: 'rgba(235, 110, 75, 0.05)',
                border: '1px solid rgba(235, 110, 75, 0.2)',
                borderRadius: 8,
                padding: '32px',
                marginBottom: 32
              }}>
                <h3 style={{color: 'var(--clay)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8}}>
                  <Icon name="check" size={20} stroke={3} /> Inquiry sent
                </h3>
                <p style={{color: 'var(--ink-2)', lineHeight: 1.5, margin: 0}}>
                  Thanks for reaching out. Our B2B team will review your details and get back to you within 48 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="btn btn-ghost"
                  style={{marginTop: 20, padding: '8px 16px'}}
                >
                  Send another inquiry
                </button>
              </div>
            ) : null}

            <form className="news-form" style={{border: '0', display: 'flex', flexDirection: 'column', gap: 32, padding: '0'}} onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Company / team name</label>
                <input
                  type="text"
                  placeholder="Acme Corp, or Riverside FC U16s"
                  style={{borderBottom: '1px solid var(--line)'}}
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="rgrid" style={{'--gap': '24px'} as React.CSSProperties}>
                <div className="field-group">
                  <label>First name</label>
                  <input
                    type="text"
                    placeholder="Alex"
                    style={{borderBottom: '1px solid var(--line)'}}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    placeholder="Morgan"
                    style={{borderBottom: '1px solid var(--line)'}}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="rgrid" style={{'--gap': '24px'} as React.CSSProperties}>
                <div className="field-group">
                  <label>Work email address</label>
                  <input
                    type="email"
                    placeholder="alex.morgan@company.com"
                    style={{borderBottom: '1px solid var(--line)'}}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Phone number</label>
                  <input
                    type="tel"
                    placeholder="+1 (212) 555-0198"
                    style={{borderBottom: '1px solid var(--line)'}}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="rgrid" style={{'--gap': '24px'} as React.CSSProperties}>
                <div className="field-group">
                  <label>What kind of trip?</label>
                  <select
                    style={{borderBottom: '1px solid var(--line)', background: 'transparent'}}
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                  >
                    {INQUIRY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {isTravelAgency ? (
                  <div className="field-group">
                    <label>Desired margin % (optional)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      placeholder="e.g. 15"
                      style={{borderBottom: '1px solid var(--line)'}}
                      value={marginPercent}
                      onChange={e => setMarginPercent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="field-group">
                    <label>Group size (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 24"
                      style={{borderBottom: '1px solid var(--line)'}}
                      value={groupSize}
                      onChange={e => setGroupSize(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="field-group">
                <label>Tell us more</label>
                <textarea
                  placeholder="Dates, destination, budget range, and anything else we should know…"
                  style={{
                    border: '0',
                    borderBottom: '1px solid var(--line)',
                    background: 'transparent',
                    padding: '12px 0',
                    fontSize: 14,
                    fontFamily: 'var(--sans)',
                    outline: 'none',
                    minHeight: 120,
                    resize: 'none'
                  }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{alignSelf: 'flex-start', padding: '16px 40px', background: 'var(--forest)', border: '1px solid var(--forest)', color: 'var(--paper)'}}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Request a quote'}
              </button>
            </form>
          </div>
          <aside>
            <div style={{display: 'flex', flexDirection: 'column', gap: 56}}>
              <div>
                <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20}}>Direct lines</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                    <Icon name="mail" size={14} style={{color: 'var(--clay)'}}/>
                    <span style={{fontSize: 16}}>b2b@kushmud.com</span>
                  </div>
                  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                    <Icon name="users" size={14} style={{color: 'var(--clay)'}}/>
                    <span style={{fontSize: 16}}>+1 (212) 555-0198</span>
                  </div>
                </div>
              </div>
              <div style={{padding: '32px', background: 'var(--sand)', borderRadius: 4}}>
                <h5 style={{fontSize: 16, marginBottom: 12}}>Already have a planner?</h5>
                <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 20}}>Reach out to them directly, or reply to your last itinerary email — they'll pick this up faster than a new inquiry.</p>
                <div style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, fontWeight: 500}}>
                  <Icon name="shield" size={14} style={{color: 'var(--forest)'}}/>
                  <span>Dedicated account management</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{background: 'var(--forest)', padding: '80px 0'}}>
        <div className="container" style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'rgba(244,237,224,0.6)'}}>— Ready when you are</span>
          <h2 style={{color: 'var(--paper)', marginTop: 16, marginBottom: 10}}>Planning for a group?<br/><em style={{fontStyle:'italic'}}>Let's talk logistics.</em></h2>
          <p style={{color: 'rgba(244,237,224,0.72)', fontSize: 16, marginTop: 20, marginBottom: 40}}>One inquiry, one dedicated planner, from first quote to the final transfer home.</p>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-primary" style={{background: 'var(--sand)', color: 'var(--forest)', borderColor: 'var(--sand)', fontSize: 15, padding: '16px 36px'}}>
            Start your inquiry
          </a>
        </div>
      </div>
    </MainLayout>
  );
}

export default function B2BPage() {
  return (
    <Suspense fallback={<div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <B2BContent />
    </Suspense>
  );
}
