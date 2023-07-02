import Camera from 'react-html5-camera-photo';
import {useSelector} from 'react-redux';
import {getUser} from '../../store/reducers/userSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import './EventRegistrationPage.less';
import {get, push, ref, update} from "firebase/database"
import {db, eventRef} from "../../app/firebase";
import {Toast} from "react-toastify/dist/components";
import {toast} from "react-toastify";

const EventRegistrationPage = () => {
  const {fullName} = useSelector(getUser);
  const [cookies] = useCookies(['user']);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const params = useParams()

  useEffect(() => {
    if (!cookies?.user?.email) {
      // navigate('/', { state: { from: '/register-event/111' } });
    }
  }, [cookies]);

  const handleTakePhoto = (dataUri: any) => {
    setPhoto(dataUri);
  };

  const handleCameraToggle = () => {
    setShowCamera(!showCamera);
  };
  const handleSubmit = async () => {
    const eventId = (useParams()).eventId
    const eventSnapshot = await get(ref(db, `/events/${eventId}`))
    if (eventSnapshot.exists()) {
      const event = eventSnapshot.val();

      console.log(!event.subscribers?.includes(user.email))
      if (!event.subscribers?.includes(user.email)) {
        await update(ref(db, `events/${eventId}`), {
          ...event,
          // subscribers: [...event.subscribers, user?.email]
        });
      } else {
        toast.warning("You already register to this event")
      }
    } else {
      toast.error("The event doesn't exist")
      navigate('/', {state: {from: '/events'}})
    }
  }
  handleSubmit().then(console.log)
  return (
    <div className="event-registration-container">
      <h2>Event Registration</h2>
      <p>Welcome, {fullName}! Please take a selfie for the event.</p>
      <form>
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
        <button className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EventRegistrationPage;
