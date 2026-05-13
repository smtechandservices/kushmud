'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { PACKAGES } from '@/lib/data';
import { MainLayout } from '@/components/MainLayout';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const pkgId = searchParams.get('pkg');
  const pkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];
  
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
              <input defaultValue="Alex"/>
            </div>
            <div className="field-group">
              <label>Last name</label>
              <input defaultValue="Morgan"/>
            </div>
            <div className="field-group full">
              <label>Email</label>
              <input defaultValue="alex.morgan@email.com"/>
            </div>
            <div className="field-group">
              <label>Phone</label>
              <input defaultValue="+1 (415) 555 0192"/>
            </div>
            <div className="field-group">
              <label>Passport country</label>
              <select><option>United States</option></select>
            </div>
            <div className="field-group full">
              <label>Dietary or access notes (optional)</label>
              <input placeholder="Vegetarian, mobility needs, allergies…"/>
            </div>
          </div>

          <div style={{height:48}}></div>

          <h3>Traveler 2</h3>
          <div className="formgrid">
            <div className="field-group">
              <label>First name</label>
              <input defaultValue="Sam"/>
            </div>
            <div className="field-group">
              <label>Last name</label>
              <input defaultValue="Morgan"/>
            </div>
            <div className="field-group full">
              <label>Date of birth</label>
              <input defaultValue="1989-07-12"/>
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
              <input defaultValue="Alex Morgan"/>
            </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', marginTop:48, alignItems:'center'}}>
            <Link href={`/packages/${pkg.id}`} className="btn btn-ghost">← Back to itinerary</Link>
            <button className="btn btn-clay btn-lg" onClick={() => alert('Booking submitted — your planner will be in touch within 4 hours.')}>
              Reserve trip · ${(pkg.price * 2 + 72).toLocaleString()} <Icon name="arrow-right" size={14}/>
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
