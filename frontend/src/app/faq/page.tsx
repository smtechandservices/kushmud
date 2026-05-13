'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "For Rajasthan during the peak season (October to March), we recommend booking 4–6 months in advance to secure our preferred heritage properties. For Dubai and Abu Dhabi, 3 months is usually sufficient."
  },
  {
    q: "Are flights included in the price?",
    a: "Our listed prices are for land arrangements only. This gives you the flexibility to use miles or choose your preferred carrier. However, we can certainly assist with booking internal flights within India or regional transfers between the UAE and India."
  },
  {
    q: "What is your cancellation policy?",
    a: "We offer a flexible cancellation policy: 100% refund (minus a $150 admin fee) up to 60 days before departure. Within 60 days, fees apply based on our partner property policies. We always recommend comprehensive travel insurance."
  },
  {
    q: "Do you cater to specific dietary requirements?",
    a: "Absolutely. Our planners personally brief every hotel and guide on your requirements—whether it's gluten-free, vegan, or specific allergies. In India, vegetarian options are exceptionally diverse and of high quality."
  },
  {
    q: "Can I customize an existing package?",
    a: "Yes. Every itinerary on our site is a starting point. We can add nights, change properties, or swap activities to better suit your interests. Just mention your preferences during your initial consultation."
  }
];

export default function FAQPage() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>FAQ</span></div>
          <h1 style={{fontSize:64}}>Frequently asked,<br/><em style={{fontStyle:'italic'}}>clearly answered.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{maxWidth: 800, margin: '0 auto'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{borderBottom: '1px solid var(--line)', paddingBottom: 16}}>
                <button 
                  onClick={() => setActive(active === i ? null : i)}
                  style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: '0', padding: '16px 0', textAlign: 'left', cursor: 'pointer'}}
                >
                  <span style={{fontSize: 20, fontFamily: 'var(--serif)', color: 'var(--ink)'}}>{faq.q}</span>
                  <div style={{transform: active === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>
                    <Icon name="arrow-right" size={16} style={{transform: 'rotate(90deg)'}}/>
                  </div>
                </button>
                {active === i && (
                  <div style={{padding: '0 0 16px', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', opacity: 0.8}}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{marginTop: 96, padding: '48px', border: '1px solid var(--line)', borderRadius: 4, textAlign: 'center'}}>
            <h3 style={{fontSize: 24, marginBottom: 16}}>Still have questions?</h3>
            <p style={{color: 'var(--muted)', marginBottom: 32}}>Our planners are happy to jump on a call to discuss the finer details of your trip.</p>
            <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
              <button className="btn btn-primary">Schedule a call</button>
              <button className="btn btn-ghost">Email us</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
