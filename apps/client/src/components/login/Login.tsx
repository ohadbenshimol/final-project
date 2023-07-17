import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { setUser, UserState } from '../../store/reducers/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { orderByChild, push, equalTo, query, get } from 'firebase/database';
import { usersRef } from '../../helpers/firebase';
import FacebookLogin from '@greatsumini/react-facebook-login';

import AppleLogin from 'react-apple-login';

import './Login.less';
import { AppleOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);

      dispatch(setUser(cookies.user));
      navigate('/own-events'); //TODO
    }
  }, [cookies, dispatch]);

  const handleSuccess = async (response: CredentialResponse, from?: string) => {
    if (response.credential) {
      const responsePayload: any = jwt_decode(response.credential);
      let tempUser: Partial<UserState> = {
        email: responsePayload.email,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name || 'lastName',
        fullName: responsePayload.name || 'fullname',
        pictureUrl: responsePayload.picture || '.../../',
        sub: responsePayload.sub,
      };

      let user: UserState = { ...tempUser };
      const userWithSameSub = await get(
        query(usersRef, orderByChild('sub'), equalTo(responsePayload.sub))
      );

      if (userWithSameSub.exists()) {
        userWithSameSub.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          user = { ...childData, id: childKey };
        });
      } else {
        const newEventRef = push(usersRef, tempUser);
        user = { ...tempUser, id: newEventRef.key! };
      }

      if (from) {
        navigate(from);
      }

      toast.success(`welcome ${user.firstName} ${user.lastName}`);
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
      <h1>lets get startes </h1>
      <GoogleLogin
        useOneTap
        onSuccess={(response) => handleSuccess(response, location.state?.from)}
        onError={handleError}
      />

      <div className="apple">
        <AppleLogin
          clientId="YOUR_CLIENT_ID"
          redirectURI="YOUR_REDIRECT_URL"
          usePopup
          callback={handleError} // Catch the response
          scope="email name"
          responseMode="query"
          render={(
            renderProps //Custom Apple Sign in Button
          ) => (
            <button
              onClick={renderProps.onClick}
              style={{
                backgroundColor: 'white',
                padding: 10,
                border: '1px solid black',
                fontFamily: 'none',
                lineHeight: '25px',
                fontSize: '25px',
              }}
            >
              <AppleOutlined rev />
              Continue with Apple
            </button>
          )}
        />
      </div>
      <div className="facebook">
        <FacebookLogin
          appId={'appId'}
          initParams={{
            version: 'v10.0',
          }}
          style={{
            backgroundColor: '#4267b2',
            color: '#fff',
            fontSize: '16px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
};

export default Login;
