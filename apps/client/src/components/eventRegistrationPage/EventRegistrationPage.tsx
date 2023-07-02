import Camera from 'react-html5-camera-photo';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './EventRegistrationPage.less';

const EventRegistrationPage = () => {
  const { fullName } = useSelector(getUser);
  const [cookies] = useCookies(['user']);

  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!cookies?.user?.email) {
      navigate('/', { state: { from: '/register-event/111' } });
    }
  }, [cookies]);

  const handleTakePhoto = (dataUri: any) => {
    setPhoto(dataUri);
  };

  const handleCameraToggle = () => {
    setShowCamera(!showCamera);
  };

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
