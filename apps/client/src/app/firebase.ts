import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBPCx72jB7LSRKlwjE-crBCbBjXHfGwvMU',
  authDomain: 'final-project-502ce.firebaseapp.com',
  projectId: 'final-project-502ce',
  storageBucket: 'final-project-502ce.appspot.com',
  messagingSenderId: '228999137234',
  appId: '1:228999137234:web:05335a5066a2355ed6aa0b',
  measurementId: 'G-RSXBSDRXKV',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
