import { fb_db } from "./fb-initializer";
import { collection, doc, getDoc } from 'firebase/firestore/lite';

export const GetReplacementRequestById = async (id: string | undefined) => {
  try {
    const replacementRequestCollection = collection(fb_db, "replacement-requests");
    const singleRequest = doc(replacementRequestCollection, id);
    const response = await getDoc(singleRequest);
    const data = response.data();
    console.log(`Data: ${JSON.stringify(data)}`)
    return({data:data, id:id})
  } catch (error) {
    console.log(`Error in GetReplacementRequestById: ${error}`)
    return null
  }
};
