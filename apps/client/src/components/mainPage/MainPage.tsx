import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { UserState, setUser } from '../../store/reducers/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import './MainPage.less';

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);

      dispatch(setUser(cookies.user));
      navigate('/events');
    }
  }, [cookies, dispatch]);

  const handleSuccess = async (response: CredentialResponse, from?: string) => {
    if (response.credential) {
      const responsePayload: any = jwt_decode(response.credential);

      const user: UserState = {
        email: responsePayload.email,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name,
        fullName: responsePayload.name,
        pictureUrl: responsePayload.picture,
      };

      if (from) {
        navigate(from);
      }

      toast.success(`welcome ${user.fullName} :)`);
      setCookie('user', JSON.stringify(user), { path: '/' });
      dispatch(setUser(user));
    }
  };

  const handleError = () => {
    console.error('LOGIN FAILED');
    toast.error('LOGIN FAILED');
  };

  return (
    <div className="MainPage">
      <h1>Welcome to Photo Sorting App</h1>
      <GoogleLogin
        useOneTap
        onSuccess={(response) => handleSuccess(response, location.state?.from)}
        onError={handleError}
      />
    </div>
  );
};

export default MainPage;
