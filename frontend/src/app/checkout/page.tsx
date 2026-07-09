'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Package, fetchPackageById, createBooking, isCustomerLoggedIn, fetchCustomerMe } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';
import { useCurrency } from '@/context/CurrencyContext';

function todayInputValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateInput(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  if (startYear === endYear) {
    return `${startMonth} ${start.getDate()} — ${endMonth} ${end.getDate()}, ${endYear}`;
  }
  return `${startMonth} ${start.getDate()}, ${startYear} — ${endMonth} ${end.getDate()}, ${endYear}`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return /^\d{7,15}$/.test(value.trim().replace(/[\s-]/g, ''));
}

function computeTripDates(pkg: Package, departureDate: string): { dates: string; end: Date } | null {
  if (!departureDate) return null;
  const start = parseDateInput(departureDate);
  const end = new Date(start);
  end.setDate(start.getDate() + pkg.duration);
  return { dates: formatDateRange(start, end), end };
}

const PHONE_COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+974', flag: '🇶🇦' },
  { code: '+966', flag: '🇸🇦' },
  { code: '+973', flag: '🇧🇭' },
  { code: '+968', flag: '🇴🇲' },
  { code: '+92', flag: '🇵🇰' },
  { code: '+94', flag: '🇱🇰' },
  { code: '+880', flag: '🇧🇩' },
  { code: '+60', flag: '🇲🇾' },
  { code: '+63', flag: '🇵🇭' },
  { code: '+27', flag: '🇿🇦' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+34', flag: '🇪🇸' },
  { code: '+39', flag: '🇮🇹' },
  { code: '+81', flag: '🇯🇵' },
  { code: '+86', flag: '🇨🇳' },
  { code: '+7', flag: '🇷🇺' },
  { code: '+20', flag: '🇪🇬' },
];

function CheckoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pkgId = searchParams.get('pkg');

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (!isCustomerLoggedIn()) {
      const redirectTo = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }
    setIsCheckingAuth(false);
  }, [pathname, searchParams, router]);

  const [pkg, setPkg] = useState<Package | null>(null);
  const [isLoadingPkg, setIsLoadingPkg] = useState(true);
  const [pkgError, setPkgError] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckingAuth) return;
    if (!pkgId) {
      setPkgError('No package was selected.');
      setIsLoadingPkg(false);
      return;
    }
    setIsLoadingPkg(true);
    setPkgError(null);
    fetchPackageById(pkgId)
      .then(data => setPkg(data))
      .catch(() => setPkgError('We couldn\'t find that trip. Please go back and pick a package again.'))
      .finally(() => setIsLoadingPkg(false));
  }, [pkgId, isCheckingAuth]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [pax, setPax] = useState(1);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isCheckingAuth) return;
    fetchCustomerMe().then(customer => {
      const [first, ...rest] = customer.name.trim().split(/\s+/);
      setFirstName(first || '');
      setLastName(rest.join(' '));
      if (customer.email) setEmail(customer.email);
      if (customer.phone) {
        const match = PHONE_COUNTRY_CODES.find(c => customer.phone!.startsWith(c.code));
        if (match) {
          setPhoneCode(match.code);
          setPhone(customer.phone.slice(match.code.length).trim());
        } else {
          setPhone(customer.phone);
        }
      }
    }).catch(() => {});
  }, [isCheckingAuth]);

  const [departureDate, setDepartureDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = async () => {
    if (!pkg) return;
    if (!departureDate) {
      setDateError('Please select a departure date.');
      return;
    }
    const trip = computeTripDates(pkg, departureDate);
    if (!trip) {
      setDateError('Please select a departure date.');
      return;
    }
    setDateError('');

    let hasError = false;
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (!isValidPhone(phone)) {
      setPhoneError('Please enter a valid phone number (7–15 digits).');
      hasError = true;
    } else {
      setPhoneError('');
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      const data = await createBooking({
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone.trim() ? `${phoneCode} ${phone.trim()}` : '',
        pkg: pkg.title,
        dates: trip.dates,
        pax: pax,
        remarks: remarks,
        total: pkg.price * pax,
        status: 'pending',
      });
      setBookingRef(data?.id || '');
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      alert('Failed to submit your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Redirecting to log in...</div>
    );
  }

  if (isLoadingPkg) {
    return (
      <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading trip details...</div>
    );
  }

  if (pkgError || !pkg) {
    return (
      <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
        <p style={{marginBottom: 24, color: 'var(--ink-2)'}}>{pkgError || 'We couldn\'t find that trip.'}</p>
        <Link href="/packages" className="btn btn-clay btn-lg" style={{display: 'inline-flex', padding: '14px 28px', textDecoration: 'none'}}>
          Browse trips <Icon name="arrow-right" size={14} style={{marginLeft: 8}}/>
        </Link>
      </div>
    );
  }

  const trip = computeTripDates(pkg, departureDate);
  const estimatedTotal = pkg.price * pax;

  if (isSuccess) {
    return (
      <div className="container" style={{padding: '80px 0', maxWidth: 600, margin: '0 auto', textAlign: 'center'}}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(235, 110, 75, 0.1)',
          color: 'var(--clay)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <Icon name="check" size={32} stroke={3}/>
        </div>
        <h2 style={{fontSize: 32, marginBottom: 12}}>Enquiry received!</h2>
        <p style={{color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.5, marginBottom: 32}}>
          Thank you for your interest in Kushmud. Your enquiry has been received — our team will reach out
          within 1 business day to confirm availability and next steps.
        </p>
        <div style={{
          background: 'var(--paper-2)',
          border: '1px solid var(--line-2)',
          borderRadius: 8,
          padding: '20px 24px',
          marginBottom: 40,
          textAlign: 'left'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span style={{color: 'var(--muted)', fontSize: 13}}>Reference</span>
            <strong style={{fontFamily: 'var(--mono)', color: 'var(--ink)'}}>
              {bookingRef || 'Reference pending — check your email'}
            </strong>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span style={{color: 'var(--muted)', fontSize: 13}}>Trip package</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>{pkg.title}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{color: 'var(--muted)', fontSize: 13}}>Estimated cost</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>{formatPrice(estimatedTotal)}</span>
          </div>
        </div>
        <Link href="/" className="btn btn-clay btn-lg" style={{display: 'inline-flex', padding: '14px 28px', textDecoration: 'none'}}>
          Return to Homepage <Icon name="arrow-right" size={14} style={{marginLeft: 8}}/>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="crumbs" style={{padding:'32px 0 8px'}}>Kushmud / {pkg.title} / <span>Enquiry</span></div>

      <div className="checkout">
        <div>
          <h2 style={{fontSize:36, marginBottom:8}}>Just a few details.</h2>
          <p style={{color:'var(--muted)', marginBottom:32, fontSize:15}}>No payment required. Tell us about your trip and our planner will follow up to confirm availability.</p>

          <div className="steps">
            <div className="step done"><span className="n"><Icon name="check" size={11} stroke={2.5}/></span><span className="lbl">Trip selected</span></div>
            <div className="step active"><span className="n">2</span><span className="lbl">Travelers</span></div>
            <div className="step"><span className="n">3</span><span className="lbl">Confirm</span></div>
          </div>

          <h3>Trip dates</h3>
          <p>When would you like to depart?</p>
          <div className="formgrid">
            <div className="field-group full">
              <label>Departure date</label>
              <input
                type="date"
                required
                min={todayInputValue()}
                value={departureDate}
                onChange={e => { setDepartureDate(e.target.value); setDateError(''); }}
              />
              {dateError && <span style={{color: 'var(--clay)', fontSize: 12, marginTop: 4, display: 'block'}}>{dateError}</span>}
            </div>
          </div>

          <div style={{height:48}}></div>

          <h3>Lead traveler</h3>
          <p>The person we'll contact first.</p>
          <div className="formgrid">
            <div className="field-group">
              <label>First name</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)}/>
            </div>
            <div className="field-group">
              <label>Last name</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)}/>
            </div>
            <div className="field-group full">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
              />
              {emailError && <span style={{color: 'var(--clay)', fontSize: 12, marginTop: 4, display: 'block'}}>{emailError}</span>}
            </div>
            <div className="field-group">
              <label>Phone</label>
              <div style={{display:'flex', gap:8}}>
                <select
                  value={phoneCode}
                  onChange={e => setPhoneCode(e.target.value)}
                  style={{flex:'0 0 auto', width:90}}
                >
                  {PHONE_COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
                  placeholder="98765 43210"
                  style={{flex:1}}
                />
              </div>
              {phoneError && <span style={{color: 'var(--clay)', fontSize: 12, marginTop: 4, display: 'block'}}>{phoneError}</span>}
            </div>
            <div className="field-group">
              <label>Number of travelers</label>
              <input
                type="number"
                min={1}
                value={pax === 0 ? '' : pax}
                onChange={e => {
                  const raw = e.target.value;
                  if (raw === '') { setPax(0); return; }
                  const n = parseInt(raw, 10);
                  if (!isNaN(n)) setPax(n);
                }}
                onBlur={() => setPax(p => Math.max(1, p))}
              />
            </div>
          </div>

          <div style={{height:48}}></div>

          <h3>Anything we should know? (optional)</h3>
          <div className="formgrid">
            <div className="field-group full">
              <textarea
                placeholder="Anniversary trip, dietary needs, preferred flight times, budget flexibility…"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={4}
                style={{resize: 'vertical', fontFamily: 'inherit', padding: 8}}
              />
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', marginTop:48, alignItems:'center'}}>
            <Link href={`/packages/${pkg.id}`} className="btn btn-ghost">← Back to itinerary</Link>
            <button
              className="btn btn-clay btn-lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !departureDate}
            >
              {isSubmitting ? 'Submitting...' : 'Submit enquiry'} <Icon name="arrow-right" size={14}/>
            </button>
          </div>
        </div>

        <aside>
          <div className="summary-card">
            <div className="eyebrow" style={{marginBottom:16}}>— Trip summary</div>
            <div className="summary-pkg">
              <div className="img" style={{ backgroundImage:`url(${pkg.img})` }}></div>
              <div>
                <h4>{pkg.title}</h4>
                <div className="meta">{pkg.destination}</div>
                <div className="meta">{trip ? `${trip.dates} · ${pax} traveler${pax === 1 ? '' : 's'}` : `Select a departure date · ${pax} traveler${pax === 1 ? '' : 's'}`}</div>
              </div>
            </div>
            <div className="summary-row"><span>Trip · {formatPrice(pkg.price)} × {pax}</span><span>{formatPrice(estimatedTotal)}</span></div>
            <div className="summary-row total"><span>Estimated cost</span><span>{formatPrice(estimatedTotal)}</span></div>
            <div style={{display:'flex', alignItems:'flex-start', gap:10, marginTop:18, fontSize:12, color:'var(--muted)', lineHeight:1.5}}>
              <Icon name="shield" size={13} stroke={1.7}/>
              <span>This is an estimate, not a charge. No payment is collected here — our team will confirm final pricing and availability.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </MainLayout>
  );
}
