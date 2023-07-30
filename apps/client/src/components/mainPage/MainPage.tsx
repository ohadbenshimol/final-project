import React, { useCallback } from 'react';
import Particles from 'react-particles';
import { userIsLoggedIn } from '../../store/reducers/userSlice';
import { useNavigation } from '../../hooks/useNavigation';
import { Button } from 'antd';
import { Fade } from 'react-awesome-reveal';
import { loadSlim } from 'tsparticles-slim';
import './MainPage.less';

const MainPage: React.FC = () => {
  const user = userIsLoggedIn();
  const { goToLoginPage, goToMyEventsPage: goToToMyEventsPage } =
    useNavigation();

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="main-page-con">
      <Particles
        style={{
          width: '20%!important',
          height: '20%',
        }}
        width="10%"
        height="10%"
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: 'black',
            },
            links: {
              color: '#408378',
              distance: 300,
              enable: true,
              opacity: 1,

              width: 2,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 1000,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
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
          <img src={'../../assets/iphone.png'} />
        </Fade>
      </div>
    </div>
  );
};

export default MainPage;
