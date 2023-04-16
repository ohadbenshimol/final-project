import Login from '../components/login/Login';
import './App.less';

import { GoogleOAuthProvider } from '@react-oauth/google';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBPCx72jB7LSRKlwjE-crBCbBjXHfGwvMU',
  authDomain: 'final-project-502ce.firebaseapp.com',
  projectId: 'final-project-502ce',
  storageBucket: 'final-project-502ce.appspot.com',
  messagingSenderId: '228999137234',
  appId: '1:228999137234:web:05335a5066a2355ed6aa0b',
  measurementId: 'G-RSXBSDRXKV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export function App() {
  return (
    <>
      <GoogleOAuthProvider  clientId="<your_client_id>">
        hi yoel.
        <Login />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
