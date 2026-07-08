import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="brand">
              <span className="brand-wrap">
                <span className="brand-name">Kushmud<span className="dot" style={{background:'var(--clay)'}}></span></span>
                <span className="brand-sub">Travel &amp; Tourism</span>
              </span>
            </div>
            <p className="footer-tag">Considered travel served globally for people who'd rather pack light and go slow. Curated since 2017.</p>
            <br />
            <span>Safe Travels</span>
          </div>
          <div className="footer-col">
            <h5>Travel</h5>
            <Link href="/packages">Packages</Link>
            <Link href="/destinations">Destinations</Link>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <Link href="/about">Our story</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/careers">Careers</Link>
          </div>
          <div className="footer-col">
            <h5>Help</h5>
            <Link href="/contact">Contact</Link>
            <Link href="/terms">Booking terms</Link>
            <Link href="/insurance">Insurance</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="footer-col">
            <h5>Follow</h5>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://substack.com" target="_blank" rel="noopener noreferrer">Substack</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 Kushmud &nbsp; Travel &amp; Tourism</span>
        </div>
      </div>
    </footer>
  );
};
