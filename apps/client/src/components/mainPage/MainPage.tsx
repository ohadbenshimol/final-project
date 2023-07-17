import React from 'react';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import './MainPage.less';
import { Button } from 'antd';

const MainPage: React.FC = () => {
  const user = userIsLoggedIn();
  const navigate = useNavigate();

  const goToLoginPage = () => navigate('/login');
  const goToOwnEventsPage = () => navigate('/own-events');

  return (
    <div>
      <h1>מלא טקסט עם אנימציות ואיזה תמונת רקע </h1>
      <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam</h1>
      <h1>
        doloremque sequi explicabo, laborum cumque atque perspiciatis impedit
      </h1>

      <h1>
        voluptates quisquam debitis blanditiis repellat. Est consequatur ea
        molestias nemo, saepe vel ipsam?
      </h1>

      {!user ? (
        <Button onClick={goToLoginPage}>login</Button>
      ) : (
        <Button onClick={goToOwnEventsPage}>your-events</Button>
      )}
    </div>
  );
};

export default MainPage;
