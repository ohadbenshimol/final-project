import Webcam from 'react-webcam';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { get, ref, update } from 'firebase/database';
import { db } from '../../helpers/firebase';
import { useQuery } from 'react-query';
import { NewEvent } from '../../shared/models/event';
import { toast } from 'react-toastify';
import './EventRegistrationPage.less';
import { Button, Modal, ModalFuncProps, Tooltip } from 'antd';
import { Card, Image } from 'semantic-ui-react';
import defaultImg from '../../assets/default.svg';
import ConfettiExplosion from 'react-confetti-explosion';
import { UsersPhotos } from '../ownerEvents/OwnerEvents';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import {
  CameraFilled,
  CameraOutlined,
  CarryOutOutlined,
  CloudUploadOutlined,
  SendOutlined,
  ShareAltOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import Reveal, {
  Bounce,
  Fade,
  Flip,
  Hinge,
  JackInTheBox,
  Roll,
  Rotate,
  Slide,
  Zoom,
  AttentionSeeker,
} from 'react-awesome-reveal';
import { addUserToEvent } from '../../helpers/requests';
import { useNavigation } from '../../hooks/navigate';

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
  const [submit, setSubmit] = useState(false);
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
      // if (!data) Modal.error({ ...errorModalConf, onOk: navigateToEvents });
      // else if (data.subscribers[user.id!])
      //   Modal.warning({ ...warningModalConf, onOk: navigateToEvents });
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
    setSubmit(true);
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
        toast.success('Registration for the event was successfully completed');
      } catch (error) {
        toast.error('something went wrong in event registration');
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
        {shouldAnimate ? (
          <div className="first">
            <Slide direction="left" duration={1000}>
              <p style={{ fontSize: '5em' }}>Welcome {firstName}!</p>
            </Slide>
            <div className="flex" style={{ display: 'flex' }}>
              {event && (
                <Fade direction="up" duration={600} delay={500}>
                  <Card style={{ flex: 50 }}>
                    <Image
                      className="Sad"
                      style={{ height: '21em' }}
                      src={event.imgUrl || defaultImg}
                      fluid
                      ui={false}
                    />
                    <Card.Content>
                      <Card.Header>{event.name}</Card.Header>
                      <Card.Meta>
                        <span className="date">{event.creationDate}</span>
                      </Card.Meta>
                      <Card.Description>{event.description}</Card.Description>
                    </Card.Content>
                  </Card>
                </Fade>
              )}
              <Fade direction="right" duration={700}>
                <div
                  className="flex"
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <p style={{ fontSize: '2em' }}>
                    We will sign you up for the event in a minute!
                  </p>
                  <p style={{ fontSize: '5em' }}>
                    But first, let me take a selfie
                  </p>
                  <Fade direction="up" duration={2000} delay={1000}>
                    <AttentionSeeker effect="tada" duration={2000} delay={2000}>
                      <div
                        style={{
                          fontSize: '3em',
                        }}
                        onClick={() => setShouldAnimate(false)}
                      >
                        <img
                          src={
                            'https://upload.wikimedia.org/wikipedia/commons/7/7a/Selfie_icon.svg'
                          }
                        />
                      </div>
                    </AttentionSeeker>
                  </Fade>
                </div>
              </Fade>
            </div>
          </div>
        ) : (
          <div className="second">
            <div className="camera-container">
              {imgSrc ? (
                <>
                  {true && (
                    <ConfettiExplosion
                      force={0.7}
                      particleSize={20}
                      colors={['red', 'green']}
                    />
                  )}

                  <img src={imgSrc} alt="webcam" />
                </>
              ) : (
                <Webcam height={500} width={500} ref={webcamRef} />
              )}
            </div>
            <div className="buttons-container">
              {!imgSrc && (
                <CameraOutlined
                  style={{ fontSize: '3em' }}
                  rev={undefined}
                  onClick={capture}
                />
              )}

              {imgSrc && (
                <>
                  <UndoOutlined
                    style={{ fontSize: '3em' }}
                    rev={undefined}
                    onClick={retake}
                  />
                  <SendOutlined
                    style={{ fontSize: '3em' }}
                    rev={undefined}
                    onClick={handleSubmit}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default EventRegistrationPage;
