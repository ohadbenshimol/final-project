import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';

const Header = () => {
  const user = useSelector(getUser);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#3f51b5',
    color: 'white',
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
    : 'Guest';

  const defaultImg =
    'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png';
  return (
    <header style={headerStyle}>
      <h1>LOGO</h1>
      <div style={userInfoStyle}>
        <span>{userName}</span>
        <img
          src={user?.pictureUrl || defaultImg}
          alt={userName}
          style={avatarStyle}
        />
      </div>
    </header>
  );
};

export default Header;
