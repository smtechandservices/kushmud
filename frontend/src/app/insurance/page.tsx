'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function InsurancePage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Insurance</span></div>
          <h1>Travel with<br/><em style={{fontStyle:'italic'}}>peace of mind.</em></h1>
        </div>
      </div>

      <div className="container page-content">
        <div style={{margin: '0 auto'}}>
          <div style={{padding: '40px', background: 'var(--sand)', borderRadius: 4, marginBottom: 56, display: 'flex', gap: 24, alignItems: 'flex-start'}}>
            <Icon name="shield" size={32} style={{color: 'var(--forest)', flexShrink: 0, marginTop: 4}}/>
            <div>
              <h4 style={{fontSize: 22, marginBottom: 12}}>Why Insurance is Mandatory</h4>
              <p style={{fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6}}>
                At Kushmud, we require all travelers to have comprehensive travel insurance. Our routes often involve remote areas where private medical evacuation could be costly. Having the right coverage ensures that you can focus on the experience, knowing that you're protected against the unexpected.
              </p>
            </div>
          </div>

          <h3 style={{fontSize: 28, marginBottom: 32}}>What your policy should cover:</h3>
          <div className="rgrid" style={{'--gap': '24px', marginBottom: 80} as React.CSSProperties}>
            {[
              "Medical & Emergency Evacuation",
              "Trip Cancellation & Interruption",
              "Personal Accident & Liability",
              "Baggage Loss & Delay",
              "COVID-19 Related Disruptions",
              "Repatriation of Remains"
            ].map((item, i) => (
              <div key={i} style={{display: 'flex', gap: 12, alignItems: 'center', padding: '16px', border: '1px solid var(--line)', borderRadius: 4}}>
                <Icon name="check" size={14} style={{color: 'var(--clay)'}}/>
                <span style={{fontSize: 15, fontWeight: 500}}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{padding: '48px', border: '1px solid var(--line)', borderRadius: 4, textAlign: 'center'}}>
            <h4 style={{fontSize: 20, marginBottom: 16}}>Need a recommendation?</h4>
            <p style={{color: 'var(--muted)', marginBottom: 32}}>While we don't sell insurance directly, we recommend the following providers known for their reliable coverage worldwide:</p>
            <div style={{display: 'flex', gap: 32, justifyContent: 'center'}}>
              <span style={{fontSize: 18, fontWeight: 600, color: 'var(--ink)'}}>World Nomads</span>
              <span style={{fontSize: 18, fontWeight: 600, color: 'var(--ink)'}}>Allianz Travel</span>
              <span style={{fontSize: 18, fontWeight: 600, color: 'var(--ink)'}}>Travelex</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
