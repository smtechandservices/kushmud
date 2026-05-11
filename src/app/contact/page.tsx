'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Contact</span></div>
          <h1 style={{fontSize:64}}>Let's talk about<br/><em style={{fontStyle:'italic'}}>your next trip.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 100}}>
          <div>
            <form className="news-form" style={{border: '0', display: 'flex', flexDirection: 'column', gap: 32, padding: '0'}} onSubmit={e => e.preventDefault()}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                <div className="field-group">
                  <label>First name</label>
                  <input type="text" placeholder="Alex" style={{borderBottom: '1px solid var(--line)'}} />
                </div>
                <div className="field-group">
                  <label>Last name</label>
                  <input type="text" placeholder="Morgan" style={{borderBottom: '1px solid var(--line)'}} />
                </div>
              </div>
              <div className="field-group">
                <label>Email address</label>
                <input type="email" placeholder="alex.morgan@email.com" style={{borderBottom: '1px solid var(--line)'}} />
              </div>
              <div className="field-group">
                <label>Where are you thinking of going?</label>
                <select style={{borderBottom: '1px solid var(--line)', background: 'transparent'}}>
                  <option>Rajasthan, India</option>
                  <option>Kerala, India</option>
                  <option>Dubai, UAE</option>
                  <option>Abu Dhabi, UAE</option>
                  <option>I'm not sure yet</option>
                </select>
              </div>
              <div className="field-group">
                <label>How can we help?</label>
                <textarea placeholder="Tell us about your ideal pace, interests, or any questions you have…" style={{border: '0', borderBottom: '1px solid var(--line)', background: 'transparent', padding: '12px 0', fontSize: 14, fontFamily: 'var(--sans)', outline: 'none', minHeight: 120, resize: 'none'}}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{alignSelf: 'flex-start', padding: '16px 40px'}}>Send inquiry</button>
            </form>
          </div>
          <aside>
            <div style={{display: 'flex', flexDirection: 'column', gap: 56}}>
              <div>
                <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20}}>Direct lines</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                    <Icon name="mail" size={14} style={{color: 'var(--clay)'}}/>
                    <span style={{fontSize: 16}}>hello@kushmud.com</span>
                  </div>
                  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                    <Icon name="users" size={14} style={{color: 'var(--clay)'}}/>
                    <span style={{fontSize: 16}}>+1 (212) 555-0198</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20}}>Our studios</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32}}>
                  <div>
                    <h5 style={{fontSize: 15, marginBottom: 8}}>Brooklyn</h5>
                    <p style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.5}}>42 Water St, DUMBO<br/>Brooklyn, NY 11201</p>
                  </div>
                  <div>
                    <h5 style={{fontSize: 15, marginBottom: 8}}>Lisbon</h5>
                    <p style={{fontSize: 13, color: 'var(--muted)', lineHeight: 1.5}}>Rua da Boavista 14<br/>1200-066 Lisbon</p>
                  </div>
                </div>
              </div>
              <div style={{padding: '32px', background: 'var(--sand)', borderRadius: 4}}>
                <h5 style={{fontSize: 16, marginBottom: 12}}>Are you already on the road?</h5>
                <p style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 20}}>Check your confirmation email for your planner's direct WhatsApp line, available 24/7 for urgent assistance.</p>
                <div style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, fontWeight: 500}}>
                  <Icon name="shield" size={14} style={{color: 'var(--forest)'}}/>
                  <span>Emergency support active</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
