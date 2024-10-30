import { fb_db } from "./fb-initializer";
import { collection, doc, getDoc } from 'firebase/firestore/lite';

export const GetStoreById = async (id: string) => {
  try {
    const storeCollection = collection(fb_db, "stores");
    const singleStore = doc(storeCollection, id);
    const response = await getDoc(singleStore);
    const data = response.data();
    console.log(`Store Data: ${JSON.stringify(data)}`)
    return({data:data, id:id})
  } catch (error) {
    console.log(`Error in GetStoreById: ${error}`)
    return null
  }
};
