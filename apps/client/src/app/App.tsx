import MainPage from '../components/mainPage/MainPage';
import HeaderComp from '../components/header/Header';
import EventRegistrationPage from '../components/eventRegistrationPage/EventRegistrationPage';
import FileUploader from '../components/fileUploader/FileUploader';
import ParticipantsEvents from '../components/participantsEvents/ParticipantsEvents';
import FooterComp from '../components/footer/Footer';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { FC } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OwnerEvents } from '../components/ownerEvents/OwnerEvents';
import './App.less';
import '../styles.less';
import { Layout, Menu } from 'antd';

const queryClient = new QueryClient();
const { Header, Footer, Sider, Content } = Layout;

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
        <CookiesProvider>
          <Layout className="layout">
            <HeaderComp />
            <Content style={{ padding: '0 50px', minHeight: '50vh' }}>
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
            </Content>
            <FooterComp />
          </Layout>
          {/* <Layout>
            <Header>
              <HeaderComp />
            </Header>
            <Content>
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
            </Content>
            <Footer>
              <FooterComp />
            </Footer>
          </Layout> */}
          {/* <div className="app">
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
          </div> */}
        </CookiesProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
