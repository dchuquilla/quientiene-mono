import { GetDocumentById, SaveDocument } from "./fb-initializer";

export interface StoreType {
  name: string;
  email: string;
  phone: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export const GetStoreById = async (id: string) => {
  return await GetDocumentById("stores", id);
};

export const createStore = async (store: StoreType) => {
  return await SaveDocument("stores", store);
};
