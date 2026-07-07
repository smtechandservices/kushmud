'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Terms & Conditions</span></div>
          <h1 style={{fontSize:64}}>The small print,<br/><em style={{fontStyle:'italic'}}>kept simple.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{margin: '0 auto', color: 'var(--ink-2)', lineHeight: 1.6}}>
          <section style={{marginBottom: 48}}>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 24}}>01 / Booking & Payments</h4>
            <p>A deposit of 20% is required to secure your booking. The remaining balance is due 60 days before your departure. For bookings made within 60 days of departure, full payment is required at the time of booking.</p>
          </section>

          <section style={{marginBottom: 48}}>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 24}}>02 / Cancellations by You</h4>
            <p>If you need to cancel your trip, the following fees apply:</p>
            <ul style={{marginTop: 16, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12}}>
              <li><strong>60+ days before departure:</strong> Full refund minus a ₹150 administration fee per person.</li>
              <li><strong>30–59 days before departure:</strong> 50% of the total trip cost is retained.</li>
              <li><strong>Less than 30 days before departure:</strong> 100% of the total trip cost is retained.</li>
            </ul>
          </section>

          <section style={{marginBottom: 48}}>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 24}}>03 / Our Responsibility</h4>
            <p>Kushmud acts as an agent for our partner hotels, transport providers, and guides. While we take every care in selecting our partners, we cannot be held liable for their independent actions. However, we are ATOL protected, ensuring your funds are safe in the event of insolvency.</p>
          </section>

          <section style={{marginBottom: 48}}>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 24}}>04 / Insurance</h4>
            <p>Comprehensive travel insurance is mandatory for all Kushmud travelers. Your policy must cover medical expenses, personal accident, and repatriation. We recommend a policy that also covers trip cancellation.</p>
          </section>

          <div style={{paddingTop: 24, borderTop: '1px solid var(--line)', fontSize: 14, color: 'var(--muted)'}}>
            Last updated: May 11, 2026. For questions regarding these terms, please contact legal@kushmud.com.
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
