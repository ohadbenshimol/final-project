import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
} from 'react-router-dom';
import MainPage from '../components/mainPage/MainPage';
import Header from '../components/header/Header';
import { CookiesProvider, useCookies } from 'react-cookie';
import { FC, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setUser } from '../store/reducers/userSlice';
import { useDispatch } from 'react-redux';
import Events from '../components/events/events';
// import EntryPage from './components/EntryPage';
// import EventCreationPage from './components/EventCreationPage';
// import EventRegistrationPage from './components/EventRegistrationPage';

const EntryPage: FC = () => {
  return <div className="div">EntryPage</div>;
};
const EventCreationPage: FC = () => {
  return <div className="div">EventCreationPage</div>;
};
const EventRegistrationPage: FC = () => {
  return <div className="div">EventCreationPage</div>;
};

function App() {
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);

      dispatch(setUser(cookies.user));
      navigate('/events');
    }
  }, [cookies, dispatch]);

  return (
    <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
      <CookiesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/entry" Component={EntryPage} />
          <Route path="/events" Component={Events} />
          <Route path="/create-event" Component={EventCreationPage} />
          <Route
            path="/register-event/:eventId"
            Component={EventRegistrationPage}
          />
        </Routes>
      </CookiesProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
