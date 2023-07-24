import Webcam from 'react-webcam';
import defaultImg from '../../assets/default.svg';
import ConfettiExplosion from 'react-confetti-explosion';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useParams } from 'react-router-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { get, ref, update } from 'firebase/database';
import { db } from '../../helpers/firebase';
import { useQuery } from 'react-query';
import { NewEvent } from '../../shared/models/event';
import { Button, message, ModalFuncProps } from 'antd';
import { Card, Image } from 'semantic-ui-react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { CameraOutlined, SendOutlined, UndoOutlined } from '@ant-design/icons';
import { AttentionSeeker, Fade, Reveal, Slide } from 'react-awesome-reveal';
import { addUserToEvent } from '../../helpers/requests';
import { useNavigation } from '../../hooks/navigate';
import './EventRegistrationPage.less';

const defaultFormData = {
  creationDate: '',
  description: '',
  name: '',
  owner: '',
  storage: '',
  id: '',
  subscribers: {},
};

const errorModalConf: ModalFuncProps = {
  title: 'This event does not exist',
  content: 'someone give you wrong id :(',
  okText: 'go to events',
  okType: 'primary',
  centered: true,
  okButtonProps: {
    ghost: true,
  },
};

const warningModalConf: ModalFuncProps = {
  title: 'You are already registered for this event',
  content: 'come with us to events',
  okText: 'go to events',
  okType: 'primary',
  centered: true,
  okButtonProps: {
    ghost: true,
  },
};

const addUserToEventOnDb = async (
  event: NewEvent,
  eventId: string,
  userId: string
) => {
  await update(ref(db, `events/${eventId}`), {
    ...event,
    subscribers: {
      ...event.subscribers,
      [userId]: true,
    },
  });
};

const EventRegistrationPage: FC = () => {
  const user = useSelector(getUser);
  const webcamRef = useRef(null);
  const { firstName } = useSelector(getUser);
  const { eventId } = useParams();
  const [cookies] = useCookies(['user']);
  const [imgSrc, setImgSrc] = useState('');
  const [event, setEvent] = useState<NewEvent>(defaultFormData);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const { goToSharedEventsPage, goToLoginPage } = useNavigation(
    `/register-event/${eventId}`
  );

  const getEvent = async () => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    setEvent(snapshot.val());
    return snapshot.val();
  };

  useEffect(() => {
    if (!cookies?.user?.email) {
      goToLoginPage();
    }
  }, [cookies]);

  useQuery('events', async () => await getEvent(), {
    onSuccess: (data) => {
      // if (!data) Modal.error({ ...errorModalConf, onOk: goToSharedEventsPage });
      // else if (data.subscribers[user.id!])
      //   Modal.warning({ ...warningModalConf, onOk: goToSharedEventsPage });
    },
  });

  const capture = useCallback(() => {
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const retake = () => {
    setImgSrc('');
  };

  const handleSubmit = async () => {
    const event: NewEvent = await getEvent();
    // !event.subscribers[user.id!]
    if (event && eventId && user.id) {
      try {
        await addUserToEventOnDb(event, eventId, user.id);
        await addUserToEvent({
          email: user.email!,
          eventId: eventId,
          image: imgSrc,
          username: `${user.firstName} ${user.lastName}`,
        });
        await message.success(
          'Registration for the event was successfully completed'
        );
      } catch (error) {
        await message.error('something went wrong in event registration');
      } finally {
        goToSharedEventsPage();
      }
    }
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={shouldAnimate ? 'first' : 'second'}
        classNames="fade"
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        // onExited={() => setShouldAnimate(true)}
      >
        <>
          {shouldAnimate ? (
            <div className="first">
              <Slide direction="left">
                <div className="flex title">
                  <p className="sub">Welcome</p>
                  <p className="name">{firstName}!</p>
                </div>
              </Slide>
              <div className="flex card">
                {event && (
                  <Fade direction="up" duration={600} delay={500}>
                    <Card>
                      <Image
                        className="Sad"
                        src={event.imgUrl || defaultImg}
                        fluid
                        ui={false}
                      />

                      <Card.Content>
                        <Card.Header>{event.name}</Card.Header>
                        <Fade direction="up" delay={1000}>
                          <Card.Meta>
                            <span className="date">{event.creationDate}</span>
                          </Card.Meta>
                          <Card.Description>
                            {event.description}
                          </Card.Description>
                        </Fade>
                      </Card.Content>
                    </Card>
                  </Fade>
                )}

                <div
                  className="flex second-text"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '2em',
                  }}
                >
                  <Fade
                    className="fade-con"
                    direction="right"
                    duration={50}
                    cascade
                    style={{ fontSize: '2em' }}
                  >
                    We will sign you up for the event in a minute...
                  </Fade>
                  <Fade direction="right" duration={700}>
                    <p style={{ fontSize: '3em' }}>
                      But first, let me take a selfie
                    </p>
                  </Fade>
                  <Fade direction="up" delay={1000}>
                    <AttentionSeeker effect="wobble" delay={2000}>
                      <Button
                        className="btn"
                        size="middle"
                        dir="rtl"
                        icon={
                          <img
                            style={{ width: '1.6em' }}
                            src={
                              'https://upload.wikimedia.org/wikipedia/commons/7/7a/Selfie_icon.svg'
                            }
                          />
                        }
                        onClick={() => setShouldAnimate(false)}
                      >
                        to the selfie
                      </Button>
                    </AttentionSeeker>
                  </Fade>
                </div>
              </div>
            </div>
          ) : (
            <div className={`second ${imgSrc ? 'screen-shot' : ''}`}>
              <div className="camera-container">
                {imgSrc ? (
                  <>
                    {
                      <ConfettiExplosion
                        force={0.8}
                        particleCount={600}
                        colors={['var(--main-color)', 'black']}
                      />
                    }

                    <img
                      className="img-screen-shot"
                      src={imgSrc}
                      alt="webcam"
                    />
                  </>
                ) : (
                  <Webcam className="cam" ref={webcamRef} />
                )}
              </div>
              <div
                className="buttons-container"
                style={{ justifyContent: imgSrc ? 'space-between' : 'center' }}
              >
                {!imgSrc && (
                  <CameraOutlined
                    style={{ fill: 'black' }}
                    className="cam-btn"
                    rev={undefined}
                    onClick={capture}
                  />
                )}

                {imgSrc && (
                  <>
                    <UndoOutlined
                      color="black"
                      className="cam-btn"
                      rev={undefined}
                      onClick={retake}
                    />
                    <SendOutlined
                      color="black"
                      className="cam-btn send"
                      rev={undefined}
                      onClick={handleSubmit}
                    />
                  </>
                )}
              </div>
            </div>
          )}
          {imgSrc && (
            <div className="fade" style={{ justifyContent: 'center' }}>
              <Reveal delay={1000}>
                <h1 style={{ fontStyle: 'italic', fontSize: 'large' }}>
                  lockingoodddd!!!
                </h1>
              </Reveal>
            </div>
          )}
        </>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default EventRegistrationPage;
