import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Freelancing Project by{' '}
          <a 
            href="https://portfolio-sigma-black-77.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Hemasai
          </a>
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} ParkEasy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
