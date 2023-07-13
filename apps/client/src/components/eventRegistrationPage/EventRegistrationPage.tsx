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
import { Signer } from '@aws-amplify/core';

let request = {
  method: 'POST',
  url: 'https://dkl8ou2ol1.execute-api.eu-central-1.amazonaws.com/prod/add/user',
  data: {
    eventId: 'eventId',
    username: 'ohad',
    email: 'user.email',
    image: 'dasdasd',
  },
};

let access_info = {
  access_key: 'AKIAY2YE4MY2SXERX35Q',
  secret_key: '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',
};
let service_info = {
  region: 'eu-west-1',
};

// const aws4Interceptor = (aws4Axios as any).createInterceptor({
//   region: 'us-east-1',
//   accessKeyId: 'AKIAY2YE4MY2SXERX35Q',
//   secretAccessKey: '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',
// });

// axios.interceptors.request.use(aws4Interceptor);

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
    // Configure the request parameters

    const requestConfig = {
      method: 'GET',
      url: 'https://dkl8ou2ol1.execute-api.eu-central-1.amazonaws.com/prod/add/user',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    //use amplify sign()function to create the signed headers;
    let signedRequest = Signer.sign(request, access_info, service_info);

    //remove host from header
    delete signedRequest.headers['host'];

    //I normally create an instance if I need to intercept my response or request
    var instance = axios.create();

    let response = await instance(signedRequest)
      .then(function (response) {
        console.log(response);
        return response;
      })
      .catch(function (error) {
        //... handle errors
      });

    let headersList = {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      "'x-api-key'": '9K5KEYMKAk7Oj7JcIlvMmaczhutRVZgW8vW1eZOA',
      'Content-Type': 'application/json',
    };

    let bodyContent = JSON.stringify({
      eventId: 'eventId',
      username: 'username',
      email: 'email',
      image: 'fdsfdsfsdfdsfdsfsdfsdfdfdfds',
    });

    let reqOptions = {
      url: 'https://dkl8ou2ol1.execute-api.eu-central-1.amazonaws.com/prod/add/user',
      method: 'POST',
      headers: headersList,
      data: bodyContent,
    };

    let response2 = await axios.request(reqOptions);
    console.log(response2.data);

    // try {
    //   const apiUrl =
    //     'https://dkl8ou2ol1.execute-api.eu-central-1.amazonaws.com/prod/close/event';
    //   const apiKey = '9K5KEYMKAk7Oj7JcIlvMmaczhutRVZgW8vW1eZOA';
    //   const requestBody = {
    //     eventId,
    //     username: `${user.firstName} + ${user.lastName}`,
    //     email: user.email,
    //     image: 'dasdasd',
    //   };

    //   // const response = await axios(signedRequest);

    //   const response = await axios.post(apiUrl, requestBody, {
    //     headers: {
    //       'x-api-key': apiKey,
    //     },
    //   });

    //   // Handle the response
    //   console.log('Response:', response);
    // } catch (error: any) {
    //   // Handle errors
    //   console.error('Error:', error.response);
    // }
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
