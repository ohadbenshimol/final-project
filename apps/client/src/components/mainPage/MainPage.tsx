import React from 'react';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import './MainPage.less';

const MainPage: React.FC = () => {
  const user = userIsLoggedIn();
  const navigate = useNavigate();

  const goToLoginPage = () => navigate('/login');
  const goToOwnEventsPage = () => navigate('/own-events');

  return (
    <div className="MainPage">
      <h1>מלא טקסט עם אנימציות ואיזה תמונת רקע </h1>
      <h1>Welcome to Photo Sorting App</h1>
      <h1>Welcome to Photo Sorting App</h1>
      <h1>Welcome to Photo Sorting App</h1>
      <h1>Welcome to Photo Sorting App</h1>
      <h1>Welcome to Photo Sorting App</h1>

      {!user ? (
        <div className="login" onClick={goToLoginPage}></div>
      ) : (
        <div className="your-events" onClick={goToOwnEventsPage}></div>
      )}
    </div>
  );
};

export default MainPage;
