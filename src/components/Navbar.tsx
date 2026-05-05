import Link from "next/link";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";

export default function Navbar() {
  return (
    <header>
      {/* Top Bar */}
      <div className="navbar-top" style={{ backgroundColor: "var(--bg-main)", borderBottom: "none" }}>
        <div className="container navbar-top-content">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src="https://medicareclinic.ca/wp-content/uploads/2025/11/imgi_1_medicareclinic-logo.webp" 
              alt="Medicare Clinic" 
              style={{ height: "50px", objectFit: "contain" }} 
            />
          </div>
          
          <div className="navbar-contact-info">
            <div className="navbar-contact-item">
              <Mail size={16} color="var(--primary)" />
              <a href="mailto:info@medicareclinic.ca" style={{ color: "var(--text-secondary)" }}>info@medicareclinic.ca</a>
            </div>
            <div className="navbar-contact-item">
              <Phone size={16} color="var(--primary)" />
              <a href="tel:+15873563793" style={{ color: "var(--text-secondary)" }}>+1 587-356-3793</a>
            </div>
            <div className="navbar-contact-item">
              <MessageCircle size={16} color="var(--primary)" />
              <span>+1 587-356-3793</span>
            </div>
            <div className="navbar-contact-item">
              <Clock size={16} color="var(--primary)" />
              <span>Open Daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="navbar-bottom" style={{ backgroundColor: "var(--bg-main)", boxShadow: "none", borderBottom: "1px solid var(--border)" }}>
        <div className="container navbar-bottom-content" style={{ justifyContent: "flex-end" }}>
          <div className="navbar-actions">
            <a href="https://medicareclinic.ca/" target="_blank" rel="noopener noreferrer" className="btn btn-navy" style={{ textDecoration: "none" }}>
              Visit Our Website
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
