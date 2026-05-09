import LeadForm from "@/components/LeadForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity, Shield, Clock } from "lucide-react";
export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Medicare Clinic – Memorial Drive",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "171 52 St SE",
      "addressLocality": "Calgary",
      "addressRegion": "AB",
      "postalCode": "T2A 5H8",
      "addressCountry": "CA"
    },
    "telephone": "+15873563793", // using one of the existing clinic numbers
    "url": "https://medicareclinic.ca"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main style={{ position: "relative", overflow: "hidden" }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-10%",
        width: "50%",
        height: "50%",
        background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)",
        opacity: 0.5,
        zIndex: -1,
        borderRadius: "50%",
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "0",
        right: "-5%",
        width: "40%",
        height: "40%",
        background: "radial-gradient(circle, rgba(3, 152, 85, 0.1) 0%, transparent 70%)",
        opacity: 0.5,
        zIndex: -1,
        borderRadius: "50%",
      }} />

      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "4rem",
          alignItems: "center" 
        }}>
          
          <div className="animate-fade-in">
            <div style={{ 
              display: "inline-block", 
              padding: "0.5rem 1rem", 
              backgroundColor: "var(--primary-light)", 
              color: "var(--primary)",
              borderRadius: "2rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              marginBottom: "1.5rem"
            }}>
              Premier Medical Network
            </div>
            
            <h1 style={{ fontSize: "3.5rem", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
              Expert Medical Care, <br/>
              <span style={{ color: "var(--primary)" }}>Tailored to You.</span>
            </h1>
            
            <p style={{ fontSize: "1.25rem", marginBottom: "2rem", maxWidth: "600px" }}>
              Connect with top-tier clinical professionals. Submit your details to request a specialized consultation.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.75rem", backgroundColor: "var(--bg-card)", borderRadius: "50%", boxShadow: "var(--shadow-sm)" }}>
                  <Shield color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Trusted Professionals</h4>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>Verified clinical experts across multiple disciplines.</p>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.75rem", backgroundColor: "var(--bg-card)", borderRadius: "50%", boxShadow: "var(--shadow-sm)" }}>
                  <Activity color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Advanced Healthcare</h4>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>State-of-the-art medical consultation services.</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.75rem", backgroundColor: "var(--bg-card)", borderRadius: "50%", boxShadow: "var(--shadow-sm)" }}>
                  <Clock color="var(--primary)" size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Rapid Response</h4>
                  <p style={{ fontSize: "0.875rem", margin: 0 }}>Fast scheduling and priority appointments.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in delay-2">
            <LeadForm />
          </div>

        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
