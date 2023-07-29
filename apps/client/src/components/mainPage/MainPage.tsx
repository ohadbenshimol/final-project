import React from 'react';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { useNavigation } from '../../hooks/navigate';
import './MainPage.less';

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
        src={'../../assets/NIG.png'}
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
      <div className="d">
        <h1>hwerewre</h1>
        <button className="button-65" role="button">
          Get Started
        </button>
        <BezelsIphone className="color-gray" color="gray" />;
      </div>

      {/* {!user ? (
        <Button onClick={goToLoginPage}>login</Button>
      ) : (
        <Button onClick={goToToMyEventsPage}>your-events</Button>
      )} */}
    </div>
  );
};

export default MainPage;
