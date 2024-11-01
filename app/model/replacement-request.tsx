import { GetDocumentById } from "./fb-initializer";

export const GetReplacementRequestById = async (id: string) => {
  return await GetDocumentById("replacement-requests", id);
};

export const replacementStatusOptions: { [key: string]: string } = {
  "new-proposal": "Nueva propuesta",
  "accepted-proposal": "Propuesta aceptada",
  "rejected-proposal": "Propuesta rechazada",
  "completed": "Completado"
};
