import { useNavigate } from 'react-router-dom';

export const useNavigation = (from?: string) => {
  const navigate = useNavigate();
  const fromObj = from ? { state: { from } } : {};

  const goToLoginPage = () => {
    navigate('/login', fromObj);
  };

  const goToHomePage = () => {
    navigate('/', fromObj);
  };
  const goToMyEventsPage = () => {
    navigate('/own-events', fromObj);
  };

  const goToSharedEventsPage = () => {
    navigate('/shared-events', fromObj);
  };
  const goToAboutUsPage = () => {
    navigate('/about-us', fromObj);
  };
  const goToUploadFilePage = (id: string) => {
    navigate(`/uploadFile/${id}`);
  };

  return {
    goToLoginPage,
    goToMyEventsPage,
    goToHomePage,
    goToSharedEventsPage,
    goToAboutUsPage,
    goToUploadFilePage,
  };
};
