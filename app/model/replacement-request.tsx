import { GetDocumentById } from "./fb-initializer";

export const GetReplacementRequestById = async (id: string) => {
  return await GetDocumentById("replacement-requests", id);
};
