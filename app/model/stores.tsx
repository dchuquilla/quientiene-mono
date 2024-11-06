import { GetDocumentById, SaveDocument } from "./fb-initializer";

export interface UserType {
  email?: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface StoreType {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const GetStoreById = async (id: string) => {
  return await GetDocumentById("stores", id);
};

export const createStore = async (store: StoreType) => {
  const user_data: UserType = {
    email: store.email,
    password: store.password,
    created_at: store.created_at,
    updated_at: store.updated_at,
  }

  const user_id = await SaveDocument("users", user_data);

  if (!user_id) {
    throw new Error("Error creating user");
  }

  const store_data: StoreType = {
    name: store.name,
    phone: store.phone,
    user_id: user_id,
    created_at: store.created_at,
    updated_at: store.updated_at,
  }
  return await SaveDocument("stores", store_data);
};
