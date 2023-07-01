import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './EventRegistrationPage.less';
import { useCookies } from 'react-cookie';

const EventRegistrationPage = () => {
  const user = useSelector(getUser);

  const [cookies, setCookie] = useCookies(['user']);

  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!cookies?.user?.email) {
      navigate('/', { state: { from: '/register-event/111' } });
    }
  }, []);

  const handleTakePhoto = (dataUri: any) => {
    setPhoto(dataUri);
  };

  const handleCameraToggle = () => {
    setShowCamera(!showCamera);
  };
  return (
    <div className="event-registration-container">
      <h2>Event Registration</h2>
      <p>Welcome, {user.fullName}! Please take a selfie for the event.</p>
      <form>
        <div className="camera-container">
          {showCamera && (
            <Camera
              onTakePhoto={(dataUri) => {
                handleTakePhoto(dataUri);
              }}
            />
          )}
          {photo && <img src={photo} alt="Selfie" />}
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
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EventRegistrationPage;
