import React, {useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import {getUserID, setUser, UserState} from '../../store/reducers/userSlice';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {toast} from 'react-toastify';
import {useCookies} from 'react-cookie';
import './MainPage.less';
import {onValue, orderByChild, push, ref, equalTo, query, get} from "firebase/database";
import {db, eventRef} from "../../helpers/firebase";


const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(['user']);
  const userID = useSelector(getUserID)
  useEffect(() => {
    if (cookies.user) {
      console.log(cookies.user);

      dispatch(setUser(cookies.user));
      navigate('/events');
    }
  }, [cookies, dispatch]);


  const handleSuccess = async (response: CredentialResponse, from?: string) => {
    let user: UserState | undefined
    if (response.credential) {
      const responsePayload: any = jwt_decode(response.credential);
      let tempUser: Partial<UserState> = {
        email: responsePayload.email,
        firstName: responsePayload.given_name,
        lastName: responsePayload.family_name || "lastName",
        fullName: responsePayload.name || "fullname",
        pictureUrl: responsePayload.picture || ".../../",
        sub: responsePayload.sub
      };

      //TODO:Get all users, and check if there is sup filed exists


      // const eventQuery = query(
      //   ref(db, 'users/'),
      //   orderByChild(`sup`),
      //   equalTo(responsePayload.sup)
      // );
      //
      // onValue(eventQuery, (snapshot) => {
      //   const data = snapshot.val() as Record<string, UserState>;
      //   const a: Event[] = Object.values(data).filter(
      //     (_) => _.owner === '-NZRXam9S3NibCYQ1bXU'
      //   );
      //   console.log('events that i am participant', data);
      // });
      const eventSnapshot = await get(ref(db, `/users`))

      const users: Record<string, UserState> = eventSnapshot.val()
      user = Object.values(users)?.find(value => value.sub === responsePayload.sub)
      if (!user) {
        const newEventRef = push(ref(db, 'users/'), tempUser);
        user = {...tempUser, id: newEventRef.key!}
      }else {

      }


      if (from) {
        navigate(from);
      }

      toast.success(`welcome ${user?.fullName} :)`);
      setCookie('user', JSON.stringify(user), {path: '/'});
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
