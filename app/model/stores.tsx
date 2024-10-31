import { GetDocumentById } from "./fb-initializer";

export const GetStoreById = async (id: string) => {
  return await GetDocumentById("stores", id);
};
