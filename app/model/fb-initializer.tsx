import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
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
