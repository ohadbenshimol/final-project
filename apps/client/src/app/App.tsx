import {initDB} from "../helpers/init-firebase";
import Login from '../components/login/Login';
import './App.less';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import Events from "../components/events/events";
import EventForm from "../components/event-form/EventForm";

const queryClient = new QueryClient()
initDB()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <GoogleOAuthProvider clientId="<your_client_id>">
        hi yoel.
        <Login/>
        <Events/>
        <EventForm/>
      </GoogleOAuthProvider>
    </QueryClientProvider>

  );
}

export default App;
