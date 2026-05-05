"use client";

import { useEffect, useState } from "react";
import { getLeads, getFormFields, deleteLead, FormField } from "@/lib/formService";
import { Loader2, Download, Search, Eye, Trash2, X } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedLeads, fetchedFields] = await Promise.all([
          getLeads(),
          getFormFields()
        ]);
        setLeads(fetchedLeads);
        setFields(fetchedFields);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const searchString = JSON.stringify(lead).toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Date", "Status", ...fields.map(f => f.label)];
    const rows = filteredLeads.map(lead => {
      const date = new Date(lead.createdAt).toLocaleDateString();
      const baseData = [lead.id, date, lead.status || "new"];
      const dynamicData = fields.map(f => `"${(lead[f.name] || "").toString().replace(/"/g, '""')}"`);
      return [...baseData, ...dynamicData].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `medical-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setDeleting(id);
    try {
      await deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <Loader2 className="animate-spin" size={32} color="var(--primary)" />
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Lead Management</h1>
          <p style={{ margin: 0 }}>View and manage patient consultation requests.</p>
        </div>
        <button onClick={exportCSV} className="btn btn-primary" disabled={leads.length === 0}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="card" style={{ padding: "0" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <div style={{ position: "absolute", top: "50%", left: "1rem", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search leads..." 
              style={{ paddingLeft: "2.75rem", marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                {fields.slice(0, 3).map(field => ( 
                  <th key={field.id}>{field.label}</th>
                ))}
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 3} style={{ textAlign: "center", padding: "3rem" }}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{new Date(lead.createdAt).toLocaleDateString()}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {new Date(lead.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    {fields.slice(0, 3).map(field => (
                      <td key={field.id}>
                        <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead[field.name] || "-"}
                        </div>
                      </td>
                    ))}
                    <td>
                      <span style={{ 
                        padding: "0.25rem 0.75rem", 
                        backgroundColor: lead.status === "new" ? "var(--primary-light)" : "var(--bg-main)",
                        color: lead.status === "new" ? "var(--primary)" : "var(--text-secondary)",
                        borderRadius: "1rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "capitalize"
                      }}>
                        {lead.status || "New"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="btn btn-secondary" 
                          style={{ padding: "0.5rem", border: "none" }}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="btn btn-secondary" 
                          style={{ padding: "0.5rem", border: "none", color: "var(--danger)" }}
                          title="Delete Lead"
                          disabled={deleting === lead.id}
                        >
                          {deleting === lead.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Lead Modal */}
      {selectedLead && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
            <button 
              onClick={() => setSelectedLead(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: "1.5rem" }}>Lead Details</h2>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Submitted At</span>
                <div style={{ fontWeight: 500 }}>
                  {new Date(selectedLead.createdAt).toLocaleString()}
                </div>
              </div>
              
              {fields.map(field => (
                <div key={field.id} style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{field.label}</span>
                  <div style={{ fontWeight: 500, whiteSpace: "pre-wrap" }}>
                    {selectedLead[field.name] || "-"}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => handleDelete(selectedLead.id)} className="btn btn-danger" disabled={deleting === selectedLead.id}>
                 {deleting === selectedLead.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Delete
              </button>
              <button onClick={() => setSelectedLead(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
