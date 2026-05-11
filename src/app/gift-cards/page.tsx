'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function GiftCardsPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Gift Cards</span></div>
          <h1 style={{fontSize:64}}>Give the gift of<br/><em style={{fontStyle:'italic'}}>the road.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px', textAlign: 'center'}}>
        <div style={{maxWidth: 600, margin: '0 auto'}}>
          <div style={{aspectRatio: '1.6/1', background: 'var(--forest)', borderRadius: 12, padding: 40, color: 'white', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-lg)', marginBottom: 48}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontFamily: 'var(--serif)', fontSize: 28}}>Kushmud</div>
              <Icon name="globe" size={24}/>
            </div>
            <div>
              <div style={{fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8}}>Travel Credit</div>
              <div style={{fontSize: 32, fontFamily: 'var(--serif)'}}>$1,000</div>
            </div>
          </div>
          <p style={{fontSize: 18, lineHeight: 1.6, color: 'var(--ink-2)', marginBottom: 40}}>
            Our gift cards can be applied to any Kushmud curated trip or bespoke itinerary. They never expire, and are delivered in a beautiful physically-printed presentation box or via immediate digital delivery.
          </p>
          <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
            <button className="btn btn-primary btn-lg">Buy a gift card</button>
            <button className="btn btn-ghost btn-lg">Redeem a card</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
