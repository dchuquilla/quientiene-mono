import { GetDocumentsByField } from "./fb-initializer";
import bcrypt from 'bcryptjs';

export const GetUserByEmail = async (email: string) => {
  const stores = await GetDocumentsByField("users", "email", email);
  if (stores.length === 0) {
    return null;
  }

  return stores[0];
};

export const login = async (email: string, password: string) => {
  const store = await GetUserByEmail(email);
  if (!store) {
    throw new Error('Email not found');
  }

  if (!store.data?.password) {
    throw new Error('No password set for this store');
  }

  const passwordMatches = await bcrypt.compare(password, store.data.password);
  if (!passwordMatches) {
    throw new Error('Invalid password');
  }
  return store.data;
};
