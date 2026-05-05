import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, setDoc, query, orderBy, deleteDoc } from "firebase/firestore";

export async function deleteLead(id: string) {
  const docRef = doc(db, "leads", id);
  await deleteDoc(docRef);
}

export type FormFieldType = "text" | "email" | "tel" | "textarea" | "select" | "date";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[]; // for select type
  order: number;
}

export const DEFAULT_FIELDS: FormField[] = [
  { id: "1", name: "fullName", label: "Full Name", type: "text", required: true, order: 1 },
  { id: "2", name: "email", label: "Email Address", type: "email", required: true, order: 2 },
  { id: "3", name: "phone", label: "Phone Number", type: "tel", required: true, order: 3 },
  { id: "4", name: "preferredDate", label: "Preferred Appointment Date", type: "date", required: false, order: 4 },
  { id: "5", name: "message", label: "Additional Information", type: "textarea", required: false, order: 5 },
];

export async function getFormFields(): Promise<FormField[]> {
  try {
    const q = query(collection(db, "form_fields"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Return defaults if not configured
      return DEFAULT_FIELDS;
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FormField));
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return DEFAULT_FIELDS; // fallback
  }
}

export async function saveFormFields(fields: FormField[]) {
  // In a real app, we might want a batch write here
  // For simplicity, we assume we update them one by one or create a single config doc
  // Let's create a single doc in 'settings' for simplicity, or just save them into 'form_fields'
  const collectionRef = collection(db, "form_fields");
  
  // To replace all, ideally we'd delete existing first. 
  // For simplicity, we just use setDoc with fixed IDs based on name
  for (const field of fields) {
    const docRef = doc(db, "form_fields", field.id || field.name);
    await setDoc(docRef, field);
  }
}

export async function submitLead(data: Record<string, any>) {
  const leadsRef = collection(db, "leads");
  await addDoc(leadsRef, {
    ...data,
    createdAt: new Date().toISOString(),
    status: "new"
  });
}

export async function getLeads() {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
