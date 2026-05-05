import Link from "next/link";
import { MapPin, Phone, Printer, Mail, Activity } from "lucide-react";

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      {/* Upper Footer: Clinics Info */}
      <div className="footer-upper">
        <div className="container footer-clinics">
          
          <div className="footer-clinic">
            <h3>MEDICARE CLINIC &ndash; COUNTRY HILLS</h3>
            <div className="footer-clinic-info">
              <div className="footer-clinic-item">
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Unit 525, 500 Country Hills Blvd NE, Calgary, AB T3K 4Y7</span>
              </div>
              <div className="footer-clinic-item">
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+1 587-356-3793</span>
              </div>
              <div className="footer-clinic-item">
                <Printer size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+1 587-356-3794</span>
              </div>
              <div className="footer-clinic-item">
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <a href="mailto:info@medicareclinic.ca">info@medicareclinic.ca</a>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <strong>Working Hours:</strong><br />
                Mon - Fri: 9:00 AM - 5:00 PM<br />
                Sat - Sun: Closed
              </div>
            </div>
          </div>

          <div className="footer-clinic">
            <h3>MEDICARE CLINIC &ndash; ROYAL OAK</h3>
            <div className="footer-clinic-info">
              <div className="footer-clinic-item">
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>8650 112 Ave NW, Calgary, AB T3R 0R5</span>
              </div>
              <div className="footer-clinic-item">
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+1 403-247-4700</span>
              </div>
              <div className="footer-clinic-item">
                <Printer size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+1 403-247-4705</span>
              </div>
              <div className="footer-clinic-item">
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <a href="mailto:info@medicareclinic.ca">info@medicareclinic.ca</a>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <strong>Working Hours:</strong><br />
                Mon - Fri: 8:30 AM - 4:30 PM<br />
                Sat - Sun: Closed
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer */}
      <div className="footer-lower">
        <div className="container footer-grid">
          
          <div className="footer-col">
            <div style={{ marginBottom: "1.5rem", backgroundColor: "white", display: "inline-block", padding: "0.75rem 1rem", borderRadius: "0.5rem" }}>
              <img 
                src="https://medicareclinic.ca/wp-content/uploads/2025/11/imgi_1_medicareclinic-logo.webp" 
                alt="Medicare Clinic" 
                style={{ height: "40px", objectFit: "contain", display: "block" }} 
              />
            </div>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
              Providing exceptional medical care and specialty consultation services with state-of-the-art facilities across Calgary.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FacebookIcon /></a>
              <a href="#" className="social-icon"><TwitterIcon /></a>
              <a href="#" className="social-icon"><YoutubeIcon /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <nav className="footer-links">
              <Link href="/">Home</Link>
              <Link href="#services">Services</Link>
              <Link href="#doctors">Doctors</Link>
              <Link href="#about">About Us</Link>
              <Link href="#faq">FAQs</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4>Our Locations</h4>
            <div className="footer-links" style={{ color: "#9ca3af" }}>
              <span>Country Hills NW</span>
              <span>Royal Oak NW</span>
              <span>Memorial Drive SE</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Medical Specialties</h4>
            <div className="footer-links" style={{ color: "#9ca3af" }}>
              <span>Family Physician</span>
              <span>Pediatrician</span>
              <span>Internist</span>
              <span>Psychiatrist</span>
              <span>Pain Specialist</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
