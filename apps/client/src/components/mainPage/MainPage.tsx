import React from 'react';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { Button } from 'antd';
import { useNavigation } from '../../hooks/navigate';
import './MainPage.less';

import PropTypes from 'prop-types';
interface BezelsIphoneProps {
  color: string;
  className: string; // The 'className' prop is optional and has a default type of 'string'
}
export const BezelsIphone: React.FC<BezelsIphoneProps> = ({
  color,
  className,
}) => {
  return (
    <div className={`bezels-iphone ${className}`}>
      <img
        className="iphone-pro-deep"
        alt="Iphone pro deep"
        src={'../../assets/a.png'}
      />
    </div>
  );
};

const MainPage: React.FC = () => {
  const user = userIsLoggedIn();
  const { goToLoginPage, goToMyEventsPage: goToToMyEventsPage } =
    useNavigation();

  return (
    <div>
      <BezelsIphone className="color-gray" color="gray" />;
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
        <Button onClick={goToToMyEventsPage}>your-events</Button>
      )}
    </div>
  );
};

export default MainPage;
