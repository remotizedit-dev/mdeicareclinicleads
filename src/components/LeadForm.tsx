"use client";

import { useState } from "react";
import { submitLead } from "@/lib/formService";
import { sendLeadEmail } from "@/app/actions/sendEmail";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    reason: "",
    source: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      // 1. Save to Firebase leads collection
      await submitLead(formData);
      
      // 2. Send Email Notification
      await sendLeadEmail(formData);

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        reason: "",
        source: ""
      });
    } catch (err) {
      setError("Failed to submit. Please try again later.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <CheckCircle color="var(--success)" size={48} style={{ margin: "0 auto 1rem" }} />
        <h3>Request Submitted</h3>
        <p>Thank you for reaching out. Our medical team will contact you shortly.</p>
        <button 
          className="btn btn-primary" 
          style={{ marginTop: "1.5rem" }}
          onClick={() => setSuccess(false)}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2rem", borderRadius: "1rem" }}>
      <h3 style={{ marginBottom: "0.5rem", fontSize: "1.75rem", color: "var(--primary)" }}>
        Book your Appointment now
      </h3>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
        Skip the waiting room. Fill out the form below and our medical team will reach out to confirm your spot!
      </p>
      
      {error && (
        <div style={{ backgroundColor: "var(--danger)", color: "white", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="firstName">
          First Name <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          className="form-input"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="lastName">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="form-input"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="phone">
          Phone Number <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="form-input"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reason">
          Reason for Visit
        </label>
        <select
          id="reason"
          name="reason"
          className="form-input"
          value={formData.reason}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Regular Checkup">Regular Checkup</option>
          <option value="Prescription Refill">Prescription Refill</option>
          <option value="Personal">Personal</option>
          <option value="Professional (WCB, Driver Medical etc.)">Professional (WCB, Driver Medical etc.)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="source">
          Where did you hear about us?
        </label>
        <select
          id="source"
          name="source"
          className="form-input"
          value={formData.source}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="Personal Referral">Personal Referral</option>
          <option value="Google">Google</option>
          <option value="Social Media">Social Media</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: "100%", marginTop: "1rem" }}
        disabled={submitting}
      >
        {submitting ? <><Loader2 style={{ animation: "spin 1s linear infinite" }} size={20}/> Submitting...</> : "Submit Request"}
      </button>
    </form>
  );
}
