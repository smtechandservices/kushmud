'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';
import { fetchFaqs, FAQ } from '@/lib/data';

export default function FAQPage() {
  const [active, setActive] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchFaqs().then(setFaqs).catch(console.error);
  }, []);

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>FAQ</span></div>
          <h1 style={{fontSize:64}}>Frequently asked,<br/><em style={{fontStyle:'italic'}}>clearly answered.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{margin: '0 auto'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {faqs.map((faq, i) => (
              <div key={faq.id} style={{borderBottom: '1px solid var(--line)', paddingBottom: 16}}>
                <button
                  onClick={() => setActive(active === i ? null : i)}
                  style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: '0', padding: '16px 0', textAlign: 'left', cursor: 'pointer'}}
                >
                  <span style={{fontSize: 20, fontFamily: 'var(--serif)', color: 'var(--ink)'}}>{faq.question}</span>
                  <div style={{transform: active === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>
                    <Icon name="arrow-right" size={16} style={{transform: 'rotate(90deg)'}}/>
                  </div>
                </button>
                {active === i && (
                  <div style={{padding: '0 0 16px', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', opacity: 0.8}}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{marginTop: 96, padding: '48px', border: '1px solid var(--line)', borderRadius: 4, textAlign: 'center'}}>
            <h3 style={{fontSize: 24, marginBottom: 16}}>Still have questions?</h3>
            <p style={{color: 'var(--muted)', marginBottom: 32}}>Our planners are happy to jump on a call to discuss the finer details of your trip.</p>
            <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
              <Link href="/contact" className="btn btn-primary">Schedule a call</Link>
              <a href="mailto:hello@kushmud.com" className="btn btn-ghost">Email us</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
