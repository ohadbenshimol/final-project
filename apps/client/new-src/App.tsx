import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './components/mainPage/MainPage';
import Header from './components/header/Header';
import { FC } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
  return (
    <GoogleOAuthProvider clientId="624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/entry" Component={EntryPage} />
        <Route path="/create-event" Component={EventCreationPage} />
        <Route
          path="/register-event/:eventId"
          Component={EventRegistrationPage}
        />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
