import {initDB} from "../helpers/init-firebase";
import Login from '../components/login/Login';
import {ToastContainer} from 'react-toastify';
import {GoogleOAuthProvider} from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import './App.less';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import Events from "../components/events/events";
import 'semantic-ui-css/semantic.min.css'

const queryClient = new QueryClient()
initDB()

export function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
          <Login/>
          <ToastContainer position="bottom-left"/>
          <Events/>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
