'use client';

import React from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Icon } from '@/components/Icon';

export default function CareersPage() {
  const OPENINGS = [
    { title: "Junior Trip Planner", location: "Brooklyn / Remote", type: "Full-time" },
    { title: "Field Editor (India)", location: "Delhi / Remote", type: "Contract" },
    { title: "Customer Success Lead", location: "Lisbon", type: "Full-time" },
  ];

  return (
    <MainLayout>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">Kushmud / <span>Careers</span></div>
          <h1 style={{fontSize:64}}>Work with us<br/><em style={{fontStyle:'italic'}}>in the field.</em></h1>
        </div>
      </div>

      <div className="container" style={{padding: '80px 40px 120px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 100}}>
          <div>
            <h2 style={{fontSize: 32}}>Why join Kushmud?</h2>
            <p style={{marginTop: 24, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)'}}>
              We're a small, obsessive team of travelers, writers, and logisticians. We value deep knowledge, quiet competence, and the ability to find a great cup of coffee in a strange city.
            </p>
            <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24}}>
              <div style={{display: 'flex', gap: 16}}>
                <Icon name="check" size={16} style={{color: 'var(--clay)'}}/>
                <span>Travel stipend for annual field research</span>
              </div>
              <div style={{display: 'flex', gap: 16}}>
                <Icon name="check" size={16} style={{color: 'var(--clay)'}}/>
                <span>Flexible, output-focused working culture</span>
              </div>
              <div style={{display: 'flex', gap: 16}}>
                <Icon name="check" size={16} style={{color: 'var(--clay)'}}/>
                <span>Equity in a growing, profitable company</span>
              </div>
            </div>
          </div>
          <div>
            <h4 style={{fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 32}}>Open Roles</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              {OPENINGS.map((job, i) => (
                <div key={i} style={{padding: '24px', border: '1px solid var(--line)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h5 style={{fontSize: 18, marginBottom: 4}}>{job.title}</h5>
                    <span style={{fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)', letterSpacing: '0.05em'}}>{job.location} · {job.type}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm">Apply <Icon name="arrow-right" size={12}/></button>
                </div>
              ))}
            </div>
            <p style={{marginTop: 40, fontSize: 14, color: 'var(--muted)'}}>
              Don't see a role that fits? We're always looking for talented writers and field researchers. Send your portfolio to careers@kushmud.com.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
