"use client";

import { useState, useEffect } from "react";
import { FormField, getFormFields, saveFormFields, FormFieldType } from "@/lib/formService";
import { Loader2, Plus, Trash2, GripVertical, Save } from "lucide-react";

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

  useEffect(() => {
    async function load() {
      const fetched = await getFormFields();
      setFields(fetched);
      setLoading(false);
    }
    load();
  }, []);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: `field_${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      order: fields.length + 1
    };
    setFields([...fields, newField]);
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
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Form Builder</h1>
          <p style={{ margin: 0 }}>Customize the fields shown on the landing page lead form.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={addField} className="btn btn-secondary">
            <Plus size={18} /> Add Field
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
            Save Changes
          </button>
        </div>
      </div>

      {success && (
        <div style={{ backgroundColor: "var(--success)", color: "white", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center" }}>
          Form settings saved successfully!
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {fields.map((field, index) => (
          <div key={field.id || index} className="card" style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.5rem" }}>
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
                    value={field.options?.join(", ") || ""}
                    placeholder="e.g. Option 1, Option 2, Option 3"
                    onChange={(e) => updateField(index, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
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
            No fields defined. Add a field to start building your form.
          </div>
        )}
      </div>
    </div>
  );
}
