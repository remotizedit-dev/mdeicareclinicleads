"use client";

import { useState, useEffect } from "react";
import { FormField, getFormFields, submitLead, DEFAULT_FIELDS } from "@/lib/formService";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LeadForm() {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFields() {
      try {
        const fetchedFields = await getFormFields();
        if (fetchedFields && fetchedFields.length > 0) {
          setFields(fetchedFields);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchFields();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await submitLead(formData);
      setSuccess(true);
      setFormData({});
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
      <h3 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "var(--text-primary)" }}>
        Request a Consultation
      </h3>
      
      {error && (
        <div style={{ backgroundColor: "var(--danger)", color: "white", padding: "0.75rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id || field.name} className="form-group">
          <label className="form-label" htmlFor={field.name}>
            {field.label} {field.required && <span style={{ color: "var(--danger)" }}>*</span>}
          </label>
          
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              className="form-input"
              rows={4}
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              className="form-input"
              value={formData[field.name] || ""}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              required={field.required}
              className="form-input"
              value={formData[field.name] || ""}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      
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
