import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { get, ref, update } from 'firebase/database';
import { db } from '../../helpers/firebase';
import './EventRegistrationPage.less';
import Webcam from 'react-webcam';
import { useQuery } from 'react-query';
import { Button, Modal } from 'semantic-ui-react';
import { NewEvent } from '../../shared/models/event';
import { toast } from 'react-toastify';
import axios from 'axios';

const EventRegistrationPage = () => {
  const { fullName } = useSelector(getUser);
  const [cookies] = useCookies(['user']);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [event, setEvent] = useState<NewEvent>({
    creationDate: '',
    description: '',
    name: '',
    owner: '',
    storage: '',
    id: '',
    subscribers: {},
  });
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

   const getEvent = async () => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    setEvent(snapshot.val());
    return snapshot.val();
  };

  useEffect(() => {
    if (!cookies?.user?.email) {
      navigate('/', { state: { from: `/register-event/${eventId}` } });
    }
  }, [cookies]);

  const { data } = useQuery('event', async () => await getEvent(), {
    onSuccess: (data) => {
      if (!data) {
        setMessage('/This event does not exist');
        setOpen(true);
      } else if (data.subscribers[user.id!]) {
        setMessage('You are already register for this event');
        setOpen(true);
      }
    },
  });

  const handleShowCamera = () => {
    setShowCamera(!showCamera);
  };

  const capture = useCallback(() => {
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const retake = () => {
    setImgSrc(null);
  };

  const navigateToEvents = () => {
    navigate('/', { state: { from: '/own-events' } });
  };

  const handleSubmit = async () => {
    const event: NewEvent = await getEvent();
    if (event && !event.subscribers[user.id!]) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        subscribers: {
          ...event.subscribers,
          [user.id!]: true,
        },
      });
      navigateToEvents();
      toast.success('Registration for the event was successfully completed');
    }
  };

  const a = async () => {
    try {
      const apiUrl =
        'https://myoprqyirk.execute-api.eu-central-1.amazonaws.com/Prod/add/user';
      const apiKey = 'kMqMP3vGTbgXKbrTulIC6w7h6M1yTryV26HjAE60';
      const requestBody = {
        eventId,
        username: `${user.firstName} + ${user.lastName}`,
        email: user.email,
        image: 'dasdasd',
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      // Handle the response
      console.log('Response:', response.data);
    } catch (error: any) {
      // Handle errors
      console.error('Error:', error.response.data);
    }
  };
  return (
    <div className="event-registration-container">
      <h2>Event Registration</h2>
      <h2 onClick={a}>CLICK</h2>
      <p>Welcome, {fullName}! Please take a selfie for the event.</p>
      {event && (
        <div className="ui items">
          <div className="item">
            <div className="ui tiny image">
              <img src="https://react.semantic-ui.com/images/wireframe/image.png" />
            </div>
            <div className="content">
              <p className="header">{event.name}</p>
              <div className="meta">{event.description!}</div>
              <div className="description">{event.creationDate}</div>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="container">
          {showCamera && (
            <div className="camera-container">
              {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
              ) : (
                <Webcam height={500} width={500} ref={webcamRef} />
              )}
            </div>
          )}
          <div className="buttons-container">
            {imgSrc ? (
              <button className="ui button negative " onClick={retake}>
                Retake photo
              </button>
            ) : (
              <button
                className="ui button center primary"
                onClick={showCamera ? capture : handleShowCamera}
              >
                {showCamera ? 'Capture photo' : 'Take photo'}
              </button>
            )}
            {showCamera && (
              <button
                className={
                  imgSrc
                    ? 'submit-button ui button primary '
                    : 'submit-button ui button disabled'
                }
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Modal.Content>
            <div style={{ textAlign: 'center' }}>
              <div className="ui message">
                <div className="header">Error occurred</div>
                <p color="red">{message}</p>
              </div>
              <Modal.Actions>
                <Button className="ui red button" onClick={navigateToEvents}>
                  back to events
                </Button>
              </Modal.Actions>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    </div>
  );
};
export default EventRegistrationPage;
