import MainPage from '../components/mainPage/MainPage';
import Header from '../components/header/Header';
import EventRegistrationPage from '../components/eventRegistrationPage/EventRegistrationPage';
import Events from '../components/events/events';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import { FC, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getUser, setUser } from '../store/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import EntryPage from './components/EntryPage';
// import EventCreationPage from './components/EventCreationPage';
// import EventRegistrationPage from './components/EventRegistrationPage';

const Auth: FC<{ comp: any }> = ({ comp }) => {
  const navigate = useNavigate();
  const user = useSelector(getUser);
  useEffect(() => {
    if (!user.email) {
      console.log(user);

      toast.success(`'HEY', ${user.email}`);
      navigate('/');
    }
  }, [user]);

  return <>{!user.email ? comp : null}</>;
};
const EntryPage: FC = () => {
  return <div className="div">EntryPage</div>;
};
const EventCreationPage: FC = () => {
  return <div className="div">EventCreationPage</div>;
};

const App: FC = () => {
  return (
    <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
      <CookiesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/entry" element={<Auth comp={EntryPage} />} />
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
};

export default App;
