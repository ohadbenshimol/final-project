import { UserState, setUser } from '../../store/reducers/userSlice';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../../app/firebase';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import {
  signInWithCredential as signInWithCredentialAsync,
  GoogleAuthProvider,
} from 'firebase/auth';
import jwt_decode from 'jwt-decode';
import './MainPage.less';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['user']);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log('USER', user);

  //       // dispatch(setUser(user));
  //       navigate('/entry');
  //     }
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [history, dispatch]);

  // const handleSuccess = async (response: any) => {
  //   console.log('Success:', response);

  //   const { idToken } = response;

  //   if (idToken) {
  //     const client = new OAuth2Client(
  //       '624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com'
  //     );
  //     const ticket = await client.verifyIdToken({
  //       idToken,
  //       audience:
  //         '624101518081-djj69l3n9h3h3g516vj32jhri3ehahaa.apps.googleusercontent.com',
  //     });
  //     const payload = ticket.getPayload();

  //     if (payload) {
  //       console.log('Email:', payload.email);
  //       console.log('First Name:', payload.given_name);
  //       console.log('Last Name:', payload.family_name);
  //       console.log('Full Name:', payload.name);
  //       console.log('Google ID:', payload.sub);
  //       console.log('Profile Image URL:', payload.picture);
  //     }
  //   }
  // };
  const handleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      const responsePayload: any = jwt_decode(response.credential);

      const user: UserState = {
        email: responsePayload.email,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name,
        fullName: responsePayload.name,
        pictureUrl: responsePayload.picture,
      };
      navigate('/events');
      toast.success(`welcome ${user.fullName} :)`);
      setCookie('user', JSON.stringify(user), { path: '/' });
      dispatch(setUser(user));
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="MainPage">
      <h1>Welcome to Photo Sorting App</h1>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      ;
    </div>
  );
};

export default MainPage;
