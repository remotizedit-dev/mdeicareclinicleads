import { db } from "./firebase";
import { collection, getDocs, addDoc, doc, setDoc, getDoc, query, orderBy, deleteDoc } from "firebase/firestore";

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
    const docRef = doc(db, "settings", "form");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().fields as FormField[];
    } else {
      // Document doesn't exist yet, return defaults
      return DEFAULT_FIELDS;
    }
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return DEFAULT_FIELDS; // fallback
  }
}

export async function saveFormFields(fields: FormField[]) {
  // Save the entire array as a single atomic document
  const docRef = doc(db, "settings", "form");
  await setDoc(docRef, { fields });
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
