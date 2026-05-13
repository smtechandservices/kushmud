'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function PrivateTripsPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Private Trips</span></div>
          <h1 style={{fontSize:64}}>Your trip, <em style={{fontStyle:'italic'}}>completely reconsidered.</em></h1>
          <p style={{color:'var(--muted)', marginTop:14, maxWidth:540, fontSize:15}}>Beyond our curated packages, we offer a full bespoke service for travelers seeking something singular. Your pace, your interests, our field notebook.</p>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 100, alignItems: 'center'}}>
          <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop" alt="Private trip" style={{width: '100%', borderRadius: 4, display: 'block'}} />
          <div>
            <span className="eyebrow">— Bespoke Planning</span>
            <h2 style={{marginTop: 16, fontSize: 40, lineHeight: 1.1}}>The Kushmud Private Service</h2>
            <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 32}}>
              <div style={{display: 'flex', gap: 24}}>
                <div style={{width: 40, height: 40, borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Icon name="users" size={18} style={{color: 'var(--clay)'}}/>
                </div>
                <div>
                  <h5 style={{fontSize: 18, marginBottom: 8}}>Dedicated Planner</h5>
                  <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>One point of contact from the first inquiry to the day you fly home. They know your preferences, your pace, and your coffee order.</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: 24}}>
                <div style={{width: 40, height: 40, borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Icon name="globe" size={18} style={{color: 'var(--clay)'}}/>
                </div>
                <div>
                  <h5 style={{fontSize: 18, marginBottom: 8}}>Deep Access</h5>
                  <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>Private museum visits, dinner with local artists, and access to heritage properties not listed on public platforms.</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: 24}}>
                <div style={{width: 40, height: 40, borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <Icon name="shield" size={18} style={{color: 'var(--clay)'}}/>
                </div>
                <div>
                  <h5 style={{fontSize: 18, marginBottom: 8}}>Seamless Logistics</h5>
                  <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6}}>Private chauffeurs, fast-track arrivals, and a 24/7 in-country concierge to handle the details so you don't have to.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: 120, padding: '80px', background: 'var(--forest)', color: 'white', borderRadius: 4, textAlign: 'center'}}>
          <h2 style={{color: 'white', fontSize: 44}}>Ready to start?</h2>
          <p style={{marginTop: 24, fontSize: 18, opacity: 0.8, maxWidth: 600, margin: '24px auto 0'}}>
            Tell us where you're thinking of going, or just tell us how you want to feel. We'll take it from there.
          </p>
          <div style={{marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center'}}>
            <button className="btn btn-clay btn-lg">Request a consultation</button>
            <button className="btn btn-ghost btn-lg" style={{borderColor: 'rgba(255,255,255,0.2)', color: 'white'}}>View example itineraries</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
