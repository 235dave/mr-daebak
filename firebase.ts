
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

// Hardcoded configuration as requested (replacing .env usage)
const firebaseConfig = {
  apiKey: "AIzaSyCb7J07-xM_pDAihIzfGM2Lzt14UihstaE",
  authDomain: "mr-daebak.firebaseapp.com",
  projectId: "mr-daebak",
  storageBucket: "mr-daebak.firebasestorage.app",
  messagingSenderId: "783896472640",
  appId: "1:783896472640:web:bdc6b837c88ab815c403a5",
  measurementId: "G-LMZP3TJ4XE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sandbox App ID
const PUBLIC_APP_ID = 'mr-daebak';

// Helper to construct the sandboxed path required by security rules
// Path format: /artifacts/{appId}/users/{userId}/{collectionName}
export const getScopedCollection = (uid: string, collectionName: string) => {
  // Note: The root collection is constructed manually.
  // The document structure implies we are working within a specific artifact/user scope.
  const path = `artifacts/${PUBLIC_APP_ID}/users/${uid}/${collectionName}`;
  return collection(db, path);
};

export const getScopedProfilePath = (uid: string) => {
    // Storing user profile in a subcollection 'account' with docId 'profile' 
    // to satisfy the {collectionName}/{documentId} depth requirement.
    return `artifacts/${PUBLIC_APP_ID}/users/${uid}/account/profile`;
}
