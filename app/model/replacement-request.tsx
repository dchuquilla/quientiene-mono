import { GetDocumentById, UpdateDocument } from "./fb-initializer";

export interface ReplacementRequestType {
  audio?: string;
  replacement?: string;
  brand?: string;
  model?: string;
  year?: string;
  chat_id?: string;
  city?: string;
  country?: string;
  status?: string;
  transcription?: string;
  created_at?: Date;
  updated_at?: Date;
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

export const GetReplacementRequestById = async (id: string) => {
  return await GetDocumentById("replacement-requests", id);
};

export const UpdateReplacementRequestStatus = async (id: string, status: string) => {
  const data: ReplacementRequestType = {
    "status": status,
    "updated_at": new Date()
  }
  return await UpdateDocument("replacement-requests", id, data);
}
