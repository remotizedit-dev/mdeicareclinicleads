"use client";

import { useState, useEffect } from "react";
import { FormField, getFormFields, saveFormFields, FormFieldType } from "@/lib/formService";
import { Loader2, Plus, Trash2, GripVertical, Save, X } from "lucide-react";

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Short Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone Number" },
  { value: "textarea", label: "Long Text" },
  { value: "select", label: "Dropdown Select" },
  { value: "date", label: "Date" },
];

export default function FormBuilderPage() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: "",
    name: "",
    type: "text",
    required: false,
    options: []
  });

  useEffect(() => {
    async function load() {
      const fetched = await getFormFields();
      setFields(fetched);
      setLoading(false);
    }
    load();
  }, []);

  const handleAddField = () => {
    if (!newField.label) {
      alert("Please provide a field label.");
      return;
    }
    const fieldToAdd: FormField = {
      id: Date.now().toString(),
      name: newField.name || newField.label.replace(/\s+/g, '_').toLowerCase(),
      label: newField.label,
      type: (newField.type as FormFieldType) || "text",
      required: newField.required || false,
      options: newField.options,
      order: fields.length + 1
    };
    setFields([...fields, fieldToAdd]);
    setShowAddModal(false);
    setNewField({ label: "", name: "", type: "text", required: false, options: [] });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    // Reorder
    const reordered = newFields.map((f, i) => ({ ...f, order: i + 1 }));
    setFields(reordered);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await saveFormFields(fields);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save form settings.");
    } finally {
      setSaving(false);
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
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Form Builder</h1>
          <p style={{ margin: 0 }}>Customize the fields shown on the landing page lead form.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setShowAddModal(true)} className="btn btn-secondary">
            <Plus size={18} /> Add Field
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>

      {success && (
        <div className="animate-fade-in" style={{ backgroundColor: "var(--success)", color: "white", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center" }}>
          Form settings saved successfully! They are now live on your site.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {fields.map((field, index) => (
          <div key={field.id} className="card animate-fade-in" style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.5rem" }}>
            <div style={{ color: "var(--text-secondary)", cursor: "grab", paddingTop: "0.5rem" }}>
              <GripVertical size={20} />
            </div>

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Field Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Internal Name (No spaces)</label>
                <input
                  type="text"
                  className="form-input"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Field Type</label>
                <select
                  className="form-input"
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as FormFieldType })}
                >
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                    style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: 500 }}>Required Field</span>
                </label>
              </div>

              {field.type === "select" && (
                <div className="form-group" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>
                  <label className="form-label">Options (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={field.options?.join(", ") || ""}
                    placeholder="e.g. Option 1, Option 2, Option 3"
                    onBlur={(e) => updateField(index, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => removeField(index)}
              className="btn btn-secondary"
              style={{ color: "var(--danger)", border: "none", padding: "0.5rem" }}
              title="Remove Field"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            No fields defined. Click "Add Field" to start building your form.
          </div>
        )}
      </div>

      {/* Add Field Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "500px", position: "relative", padding: "2rem" }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: "1.5rem" }}>Add New Field</h2>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Field Label (e.g., Preferred Doctor)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newField.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    setNewField({ ...newField, label, name: label.replace(/\s+/g, '_').toLowerCase() });
                  }}
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Field Type</label>
                <select
                  className="form-input"
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as FormFieldType })}
                >
                  {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {newField.type === "select" && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Options (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Male, Female, Other"
                    onBlur={(e) => setNewField({ ...newField, options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  />
                  <small style={{ color: "var(--text-secondary)", display: "block", marginTop: "0.25rem" }}>Click outside the box to confirm options.</small>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: 500 }}>Make this field required</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddField} className="btn btn-primary">
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
