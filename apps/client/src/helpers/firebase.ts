import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBPCx72jB7LSRKlwjE-crBCbBjXHfGwvMU',
  authDomain: 'final-project-502ce.firebaseapp.com',
  projectId: 'final-project-502ce',
  storageBucket: 'final-project-502ce.appspot.com',
  messagingSenderId: '228999137234',
  appId: '1:228999137234:web:05335a5066a2355ed6aa0b',
  measurementId: 'G-RSXBSDRXKV',
  databaseURL:
    'https://final-project-502ce-default-rtdb.europe-west1.firebasedatabase.app/',
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const eventsRef = ref(db, 'events/');
export const usersRef = ref(db, 'users/');
export const auth = getAuth(app);
export const storage = getStorage(app);
