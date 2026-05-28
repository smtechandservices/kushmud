'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PACKAGES, createBooking } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const pkgId = searchParams.get('pkg');
  const pkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];

  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Morgan');
  const [email, setEmail] = useState('alex.morgan@email.com');
  const [phone, setPhone] = useState('+1 (415) 555 0192');
  const [passportCountry, setPassportCountry] = useState('United States');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [traveler2First, setTraveler2First] = useState('Sam');
  const [traveler2Last, setTraveler2Last] = useState('Morgan');
  const [traveler2Dob, setTraveler2Dob] = useState('1989-07-12');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = await createBooking({
        name: `${firstName} ${lastName}`,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop",
        pkg: pkg.title,
        dates: "Oct 18 — Oct 26, 2026",
        total: pkg.price * 2 + 72,
        status: "pending",
        email: email,
        phone: phone,
        passport_country: passportCountry,
        dietary_notes: dietaryNotes,
        traveler_2_name: `${traveler2First} ${traveler2Last}`,
        traveler_2_dob: traveler2Dob
      });
      setBookingRef(data.id || 'WF-2842');
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h2 style={{fontSize: 32, marginBottom: 12}}>Booking Request Sent!</h2>
        <p style={{color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.5, marginBottom: 32}}>
          Thank you for choosing Wayfare. Your booking request has been successfully submitted and saved.
          Our planner will review details and connect with you within four hours.
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
            <span style={{color: 'var(--muted)', fontSize: 13}}>Booking Reference</span>
            <strong style={{fontFamily: 'var(--mono)', color: 'var(--ink)'}}>{bookingRef}</strong>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
            <span style={{color: 'var(--muted)', fontSize: 13}}>Trip Package</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>{pkg.title}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{color: 'var(--muted)', fontSize: 13}}>Total Cost</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>${(pkg.price * 2 + 72).toLocaleString()}</span>
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
      <div className="crumbs" style={{padding:'32px 0 8px'}}>Kushmud / {pkg.title} / <span>Booking</span></div>

      <div className="checkout">
        <div>
          <h2 style={{fontSize:36, marginBottom:8}}>Just a few details.</h2>
          <p style={{color:'var(--muted)', marginBottom:32, fontSize:15}}>You won't be charged until your planner confirms availability. Usually within four hours.</p>

          <div className="steps">
            <div className="step done"><span className="n"><Icon name="check" size={11} stroke={2.5}/></span><span className="lbl">Trip selected</span></div>
            <div className="step active"><span className="n">2</span><span className="lbl">Travelers</span></div>
            <div className="step"><span className="n">3</span><span className="lbl">Payment</span></div>
            <div className="step"><span className="n">4</span><span className="lbl">Confirm</span></div>
          </div>

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
              <input value={email} onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}/>
            </div>
            <div className="field-group">
              <label>Passport country</label>
              <select value={passportCountry} onChange={e => setPassportCountry(e.target.value)}>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div className="field-group full">
              <label>Dietary or access notes (optional)</label>
              <input 
                placeholder="Vegetarian, mobility needs, allergies…"
                value={dietaryNotes}
                onChange={e => setDietaryNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{height:48}}></div>

          <h3>Traveler 2</h3>
          <div className="formgrid">
            <div className="field-group">
              <label>First name</label>
              <input value={traveler2First} onChange={e => setTraveler2First(e.target.value)}/>
            </div>
            <div className="field-group">
              <label>Last name</label>
              <input value={traveler2Last} onChange={e => setTraveler2Last(e.target.value)}/>
            </div>
            <div className="field-group full">
              <label>Date of birth</label>
              <input value={traveler2Dob} onChange={e => setTraveler2Dob(e.target.value)}/>
            </div>
          </div>

          <div style={{height:48}}></div>

          <h3>Payment</h3>
          <p>We hold your card. We don't charge it until your trip is confirmed.</p>
          <div className="payment-tabs">
            <div className="pay-tab active"><span className="dot"></span><Icon name="lock" size={14}/> Card</div>
            <div className="pay-tab"><span className="dot"></span> Bank transfer</div>
            <div className="pay-tab"><span className="dot"></span> Pay in 3</div>
          </div>
          <div className="formgrid">
            <div className="field-group full">
              <label>Card number</label>
              <input defaultValue="4242 4242 4242 4242"/>
            </div>
            <div className="field-group">
              <label>Expiry</label>
              <input defaultValue="04 / 28"/>
            </div>
            <div className="field-group">
              <label>CVC</label>
              <input defaultValue="•••"/>
            </div>
            <div className="field-group full">
              <label>Cardholder name</label>
              <input defaultValue={`${firstName} ${lastName}`}/>
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', marginTop:48, alignItems:'center'}}>
            <Link href={`/packages/${pkg.id}`} className="btn btn-ghost">← Back to itinerary</Link>
            <button 
              className="btn btn-clay btn-lg" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reserving...' : `Reserve trip · $${(pkg.price * 2 + 72).toLocaleString()}`} <Icon name="arrow-right" size={14}/>
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
                <div className="meta">Oct 18 — Oct 26 · 2 adults</div>
              </div>
            </div>
            <div className="summary-row"><span>Trip · ${pkg.price.toLocaleString()} × 2</span><span>${(pkg.price * 2).toLocaleString()}</span></div>
            <div className="summary-row"><span>Carbon offset</span><span>$72</span></div>
            <div className="summary-row"><span>Planning fee</span><span style={{color:'var(--forest)'}}>included</span></div>
            <div className="summary-row total"><span>Total due</span><span>${(pkg.price * 2 + 72).toLocaleString()}</span></div>
            <div style={{display:'flex', alignItems:'flex-start', gap:10, marginTop:18, fontSize:12, color:'var(--muted)', lineHeight:1.5}}>
              <Icon name="shield" size={13} stroke={1.7}/>
              <span>Fully bonded. Free cancellation until 60 days before departure.</span>
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
