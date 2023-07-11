import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  setUser,
  userIsLoggedIn,
} from '../../store/reducers/userSlice';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import LOGO from '../../assets/logo.png';
import './Header.less';

const Header: FC = () => {
  const user = useSelector(getUser);
  const [, , removeCookie] = useCookies(['user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(setUser({}));
    navigate('/');
    removeCookie('user', { path: '/' });
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginLeft: '10px',
  };

  const userName = user?.fullName
    ? `${user.firstName} ${user.lastName}`
    : 'אורח';

  const defaultImg =
    'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png';

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <header style={headerStyle}>
      <img src={LOGO} style={{ width: '12em', height: '3em' }} />
      <div
        className="move-to"
        onClick={() => {
          navigate('/');
        }}
      >
        HOME
      </div>
      <div
        className="move-to"
        onClick={() => {
          navigate('/own-events');
        }}
      >
        My Events
      </div>
      <div
        className="move-to"
        onClick={() => {
          navigate('/shared-events');
        }}
      >
        Shared Events
      </div>
      <div style={userInfoStyle}>
        {userName ?? <span>{userName}</span>}
        <img
          src={user?.pictureUrl || defaultImg}
          alt={userName}
          style={avatarStyle}
        />
        {userIsLoggedIn() ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={goToHomePage}>Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;
