import MainPage from '../components/mainPage/MainPage';
import Header from '../components/header/Header';
import EventRegistrationPage from '../components/eventRegistrationPage/EventRegistrationPage';
import FileUploader from '../components/fileUploader/FileUploader';
import ParticipantsEvents from '../components/participantsEvents/ParticipantsEvents';
import Footer from '../components/footer/Footer';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { FC } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OwnerEvents } from '../components/ownerEvents/OwnerEvents';
import './App.less';
import '../styles.less';

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
        <CookiesProvider>
          <div className="app" style={{ overflow: 'scroll' }}>
            <Header />
            <hr />
            <div className="data-con">
              <Routes>
                <Route path="/" Component={MainPage} />
                <Route path="/shared-events" Component={ParticipantsEvents} />
                <Route path="/own-events" Component={OwnerEvents} />
                <Route
                  path="/register-event/:eventId"
                  Component={EventRegistrationPage}
                />
                <Route path="/uploadFile/:eventId" Component={FileUploader} />
              </Routes>
            </div>
            <hr />
            <Footer />
          </div>
        </CookiesProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
