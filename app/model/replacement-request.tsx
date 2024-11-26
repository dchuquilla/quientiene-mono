import { fb_db, GetDocumentById, GetDocumentsByField, UpdateDocument } from "./fb-initializer";
import { collection,getDocs, query, where, or, and } from 'firebase/firestore';

export interface ReplacementRequestType {
  id?: string;
  audio?: string;
  replacement?: string;
  brand?: string;
  model?: string;
  year?: string;
  chat_id?: string;
  details_key?: string;
  city?: string;
  country?: string;
  status?: string;
  transcription?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ReplacementRequestListType {
  id: string;
  data?: ReplacementRequestType;
}

export const replacementStatusOptions: { [key: string]: { badge: string, label: string } } = {
  "new": {"badge": "info", "label": "Solicitud creada"},
  "in-progress": {"badge": "warning", "label": "Solicitud en proceso"},
  "completed": {"badge": "success", "label": "Solicitud completada"},
  "new-proposal": {"badge": "info", "label": "Nueva propuesta"},
  "accepted-proposal": {"badge": "warning", "label": "Propuesta aceptada"},
  "rejected-proposal": {"badge": "failure", "label": "Propuesta rechazada"},
  "completed-proposal": {"badge": "success", "label": "Completado"},
};

export const GetAllPendingRequests = async () => {
  return await GetDocumentsByField("replacement-requests", "status", ["new", "in-progress"]);
}

export const SearchPendingRequests = async (search: string) => {
  const requestsRef = collection(fb_db, "replacement-requests");
  const q = query(requestsRef, and(
    where('status', 'in', ["new", "in-progress"]),
    or(where('replacement', '==', search),
      where('model', '==', search),
      where('brand', '==', search)
    )
  ));

  const querySnapshot = await getDocs(q);
  const documents = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
  console.log(`SearchPendingRequests replacement-requests: ${documents}`);
  return documents;
}

export const GetReplacementRequestById = async (id: string) => {
  return await GetDocumentById("replacement-requests", id);
};

export const UpdateReplacementRequestStatus = async (id: string, status: string) => {
  const data: ReplacementRequestType = {
    "status": status,
    "updated_at": new Date()
  }
  return await UpdateDocument("replacement-requests", id, data);
};
