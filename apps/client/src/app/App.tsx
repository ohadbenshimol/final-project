import MainPage from '../components/mainPage/MainPage';
import HeaderComp from '../components/header/Header';
import EventRegistrationPage from '../components/eventRegistrationPage/EventRegistrationPage';
import FileUploader from '../components/fileUploader/FileUploader';
import ParticipantsEvents from '../components/participantsEvents/ParticipantsEvents';
import FooterComp from '../components/footer/Footer';
import AboutUs from '../components/aboutUs/AboutUs';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import { FC, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OwnerEvents } from '../components/ownerEvents/OwnerEvents';
import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/reducers/userSlice';
import './App.less';
import '../styles.less';
import Login from '../components/login/Login';

const queryClient = new QueryClient();

const App: FC = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(['user']);

  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);
      dispatch(setUser(cookies.user));
    }
  }, [cookies, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
        <CookiesProvider>
          <Layout className="layout" style={{ padding: '1em' }}>
            <HeaderComp />
            <Layout.Content>
              <Routes>
                <Route path="/" Component={MainPage} />
                <Route path="/login" Component={Login} />
                <Route path="/shared-events" Component={ParticipantsEvents} />
                <Route path="/own-events" Component={OwnerEvents} />
                <Route path="/about-us" Component={AboutUs} />
                <Route
                  path="/register-event/:eventId"
                  Component={EventRegistrationPage}
                />
                <Route path="/uploadFile/:eventId" Component={FileUploader} />
              </Routes>
            </Layout.Content>
            <FooterComp />
          </Layout>
        </CookiesProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
