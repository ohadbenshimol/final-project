import jwt_decode from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '../../store/reducers/userSlice';
import { useEffect } from 'react';
import './Login.less';
import { useNavigate } from 'react-router-dom';

export interface LoginProps {}

export const Login = ({}) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(user).length) {
      navigate('/');
    }
  }, [user]);

  return (
    <div className="login-con">
      <div className="welcome-message">היי ברוך הבא בלה בלה </div>
      <GoogleLogin
        theme="outline"
        auto_select
        login_uri="http://one.com"
        useOneTap
        onSuccess={(response) => {
          if (response.credential) {
            const responsePayload: any = jwt_decode(response.credential);
            dispatch(
              setUser({
                email: responsePayload.email,
                firstName: responsePayload.given_name,
                lastName: responsePayload.family_name,
                fullName: responsePayload.name,
                pictureUrl: responsePayload.picture,
              })
            );

            toast.success(`welcome ${responsePayload.name} :)`);
            navigate('/');
          }
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />

      {user ? <div className="de">{user.email}</div> : null}
    </div>
  );
};

export default Login;

{
  /* <div>
<button
  aria-label="Increment value"
  onClick={() => dispatch(increment())}
>
  Increment
</button>
<span>{count}</span>
<button
  aria-label="Decrement value"
  onClick={() => dispatch(decrement())}
>
  Decrement
</button>
</div> */
}
