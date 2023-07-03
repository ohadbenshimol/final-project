import Camera from 'react-html5-camera-photo';
import {useSelector} from 'react-redux';
import {getUser} from '../../store/reducers/userSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import './EventRegistrationPage.less';
import {get, ref, update} from "firebase/database"


import {toast} from "react-toastify";
import {db} from "../../helpers/firebase";
import {NewEvent} from "../../shared/models/event";

const EventRegistrationPage = () => {
  const {fullName} = useSelector(getUser);
  const [cookies] = useCookies(['user']);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const eventId = (useParams()).eventId
  const params = useParams()

  useEffect(() => {
    if (!cookies?.user?.email) {
      navigate('/', {state: {from: `/register-event/${eventId}`}});
    }
  }, [cookies]);

  const handleTakePhoto = (dataUri: any) => {
    setPhoto(dataUri);
  };

  const handleCameraToggle = () => {
    setShowCamera(!showCamera);
  };
  const handleSubmit = async () => {

    const eventSnapshot = await get(ref(db, `/events/${eventId}`))
    if (eventSnapshot.exists()) {

      const event: NewEvent = eventSnapshot.val();
      if (!event.subscribers[user.id!]) {
        await update(ref(db, `events/${eventId}`), {
          ...event,
          subscribers: {
            ...event.subscribers,
            [user.id!]: true
          }
        });
      } else {
        toast.warning("You already register to this event")
        navigate('/', {state: {from: '/events'}})
      }
    } else {
      toast.error("The event doesn't exist")
      navigate('/', {state: {from: '/events'}})
    }
  }

  return (
    <div className="event-registration-container">
      <h2>Event Registration</h2>
      <p>Welcome, {fullName}! Please take a selfie for the event.</p>
      <div>
        <div className="camera-container">
          {showCamera && (
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
            />
          )}
          {photo && <img src={photo} alt="Selfie"/>}
        </div>
        {!photo && (
          <button
            className="camera-toggle-button"
            type="button"
            onClick={handleCameraToggle}
          >
            {showCamera ? 'Close Camera' : 'Take a Photo'}
          </button>
        )}
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default EventRegistrationPage;
