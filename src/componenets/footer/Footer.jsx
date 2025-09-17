import React from "react";
import { Link } from "react-router-dom";
import {
  CiMail,
  CiPhone,
  CiLocationOn,
  CiTwitter,
  CiLinkedin,
} from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <h3 className="footer-logo-text">Campus Lost Found</h3>
            </div>
            <p className="footer-description">
              Connecting students with their lost belongings across Pakistan's
              leading universities. Safe, secure, and community-driven lost and
              found platform.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <CiTwitter />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <CiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/universities">Universities</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/report">Report Lost Item</Link>
              </li>
              <li>
                <Link to="/report">Report Found Item</Link>
              </li>
              <li>
                <Link to="/dashboard">My Dashboard</Link>
              </li>
              <li>
                <Link to="/how-it-works#safety">Safety Guidelines</Link>
              </li>
              <li>
                <Link to="/how-it-works#faq">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact">Report Issues</Link>
              </li>
              <li>
                <Link to="/contact">Data Protection</Link>
              </li>
              <li>
                <Link to="/contact">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <CiMail className="contact-icon" />
                <span>campuslostfound@gmail.com</span>
              </div>
              <div className="contact-item">
                <CiPhone className="contact-icon" />
                <span>+92 3224121825</span>
              </div>
              <div className="contact-item">
                <CiLocationOn className="contact-icon" />
                <span>Pakistan Universities Network</span>
              </div>
            </div>
            <div className="footer-universities">
              <p className="universities-text">Serving 20+ Universities</p>
              <p className="universities-list">
                NUST • FAST • COMSATS • UET • PU • QAU
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>
                &copy; {currentYear} Campus Lost Found. All rights reserved.
              </p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-of-service">Terms</Link>
              <Link to="/contact">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
