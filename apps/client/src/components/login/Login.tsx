import React, {useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import {setUser, UserState} from '../../store/reducers/userSlice';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {toast} from 'react-toastify';
import {useCookies} from 'react-cookie';
import {equalTo, get, orderByChild, push, query} from 'firebase/database';
import {usersRef} from '../../helpers/firebase';
import FacebookLogin from '@greatsumini/react-facebook-login';
import {AppleFilled} from '@ant-design/icons';
import {useNavigation} from '../../hooks/navigate';
import './Login.less';
import {Header} from 'semantic-ui-react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const {goToMyEventsPage} = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);

      dispatch(setUser(cookies.user));
      goToMyEventsPage();
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

      let user: UserState = {...tempUser};
      const userWithSameSub = await get(
        query(usersRef, orderByChild('sub'), equalTo(responsePayload.sub))
      );

      if (userWithSameSub.exists()) {
        userWithSameSub.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          user = {...childData, id: childKey};
        });
      } else {
        const newEventRef = push(usersRef, tempUser);
        user = {...tempUser, id: newEventRef.key!};
      }

      if (from) {
        navigate(from);
      }

      toast.success(`welcome ${user.firstName} ${user.lastName}`);
      setCookie('user', JSON.stringify(user), {path: '/'});
      dispatch(setUser(user));
    }
  };

  const handleError = () => {
    console.error('LOGIN FAILED');
    toast.error('LOGIN FAILED');
  };

  return (
    <>
      <div className="main-page">
        <Header className={"login-header"} as='h1'>Login to your account</Header>
        <div className={"buttons-login-section"} style={{margin:'7em'}}>
          <div className="googke-signon">
            <GoogleLogin
              useOneTap
              onSuccess={(response) =>
                handleSuccess(response, location.state?.from)
              }
              onError={handleError}
            />
          </div>

          <button className="apple-signin-button">
            <div className="apple-logo-wrapper">
              <AppleFilled
                rev
                src="apple-logo.png"
                alt="Apple logo"
                className="apple-logo"
              />
            </div>
            <span className="apple-signin-text">Sign in with Apple</span>
          </button>
          <div className="facebook">
            <FacebookLogin
              appId={'appId'}
              initParams={{
                version: 'v10.0',
              }}
              style={{
                width:"max-content",
                fontSize: '1.1em',
                backgroundColor: '#4267b2',
                color: '#fff',
                padding: '0.5em 2.1em',
                border: 'none',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
