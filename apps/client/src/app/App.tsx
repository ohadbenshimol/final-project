import Login from '../components/login/Login';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { initializeApp } from 'firebase/app';
import 'react-toastify/dist/ReactToastify.css';
import './App.less';

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

export function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
        hi yoel.
        <Login />
        <ToastContainer position="bottom-left" />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
