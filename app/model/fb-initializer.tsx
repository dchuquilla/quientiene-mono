import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore/lite';
import fbConfig from "../../fb-config";

const firebaseConfig = {
  apiKey: fbConfig.fb_apiKey,
  authDomain: fbConfig.fb_authDomain,
  databaseURL: fbConfig.fb_databaseURL,
  projectId: fbConfig.fb_projectId,
  storageBucket: fbConfig.fb_storageBucket,
  messagingSenderId: fbConfig.fb_messagingSenderId,
  appId: fbConfig.fb_appId
};

// Initialize Firebase
export const fb_app = initializeApp(firebaseConfig);
export const fb_db = getFirestore(fb_app);

export const GetDocumentById = async (collectionName: string, id: string) => {
  try {
    const collectionRef = collection(fb_db, collectionName);
    const documentRef = doc(collectionRef, id);
    const response = await getDoc(documentRef);
    const data = response.data();
    console.log(`Data from ${collectionName}: ${JSON.stringify(data)}`);
    return { data, id };
  } catch (error) {
    console.log(`Error in GetDocumentById: ${error}`);
    return null;
  }
};

export const SaveDocument = async (collectionName: string, data: object) => {
  try {
    const collectionRef = collection(fb_db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    console.log(`Document written with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving document: ${error}`);
    return null;
  }
};

export const UpdateDocument = async (collectionName: string, id: string, data: object) => {
  try {
    const collectionRef = collection(fb_db, collectionName);
    const docRef = doc(collectionRef, id);
    await setDoc(docRef, data, { merge: true });
    console.log(`Document updated with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error updating document: ${error}`);
    return null;
  }
}

export const SaveRequestHistory = async (data: object) => {
  data = { ...data, "created_at": new Date(), "updated_at": new Date() };
  return await SaveDocument("request-history", data);
}

export const GetDocumentsByField = async (collectionName: string, fieldName: string, value: string) => {
  try {
    const collectionRef = collection(fb_db, collectionName);
    const q = query(collectionRef, where(fieldName, "==", value));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    console.log(`documents from ${collectionName}: ${JSON.stringify(documents)}`);
    return documents;
  } catch (error) {
    console.error(`Error in GetDocumentsByField: ${error}`);
    return [];
  }
};
