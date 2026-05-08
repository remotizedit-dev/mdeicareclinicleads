import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, setDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { unstable_noStore as noStore } from "next/cache";

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
  noStore();
  try {
    const q = query(collection(db, "form_fields"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    
    console.log("Fetched form fields from Firestore:", snapshot.docs.map(d => d.data()));

    if (snapshot.empty) {
      console.log("Snapshot empty, returning DEFAULT_FIELDS");
      // Return defaults if not configured
      return DEFAULT_FIELDS;
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FormField));
  } catch (error) {
    console.error("Error fetching form fields on server/client:", error);
    return DEFAULT_FIELDS; // fallback
  }
}

export async function saveFormFields(fields: FormField[]) {
  // First, get all existing fields to delete them so we don't have stale fields
  const q = query(collection(db, "form_fields"));
  const snapshot = await getDocs(q);
  
  // Delete all existing documents
  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, "form_fields", docSnapshot.id));
  }
  
  // Now save all the new fields
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
