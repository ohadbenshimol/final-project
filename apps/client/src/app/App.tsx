import MainPage from '../components/mainPage/MainPage';
import Header from '../components/header/Header';
import EventRegistrationPage from '../components/eventRegistrationPage/EventRegistrationPage';
import Events from '../components/events/events';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { FC } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App: FC = () => {
  return (
    <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
      <CookiesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/events" Component={Events} />
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
