import React from 'react';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { useNavigation } from '../../hooks/navigate';
import './MainPage.less';
import { Button, Image } from 'antd';
import { AttentionSeeker, Fade, Reveal, Slide } from 'react-awesome-reveal';

const MainPage: React.FC = () => {
  const user = userIsLoggedIn();
  const { goToLoginPage, goToMyEventsPage: goToToMyEventsPage } =
    useNavigation();

  return (
    <div className="main-con">
      <div className="text-and-btn">
        <div className="first-text" style={{ display: 'flex' }}>
          <Fade cascade direction="left">
            <p>Capture.</p>
            <p>Share.</p>
            <p>Cherish.</p>
          </Fade>
        </div>
        <div className="second-text">
          <Fade delay={5500} direction="left" fraction={0.2} triggerOnce>
            Making Every Adventure Unforgettable!
          </Fade>
        </div>

        {!user ? (
          <Button size="large" onClick={goToLoginPage}>
            login
          </Button>
        ) : (
          <Button size="large" onClick={goToToMyEventsPage}>
            Get Started
          </Button>
        )}
      </div>
      <div className="iphone">
        <Fade triggerOnce delay={1000} direction="up">
          {/* <Image height={'40vh'} width={'30vh'} src={'../../assets/NIG.png'} /> */}
          <img src={'../../assets/NIG.png'} />
        </Fade>
      </div>
    </div>
  );
};

export default MainPage;
