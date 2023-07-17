import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  setUser,
  userIsLoggedIn,
} from '../../store/reducers/userSlice';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import LOGO from '../../assets/logo.png';
import { Col, Layout, Menu, MenuProps, Row } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';

import './Header.less';
import Avatar from 'antd/es/avatar/avatar';

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

  const goToLoginPage = () => {
    navigate('/login');
  };
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const items: MenuProps['items'] = [
    {
      label: 'home',
      key: 'home',
      icon: <HomeOutlined rev />,
      onClick: () => {
        navigate('/');
      },
    },
    {
      label: 'My events',
      key: 'my-events',
      icon: <ShareAltOutlined rev />,
      onClick: () => {
        navigate('/own-events');
      },
    },
    {
      label: 'shared events',
      key: 'shared-events',
      icon: <ShareAltOutlined rev />,
      onClick: () => {
        navigate('/shared-events');
      },
    },
    {
      label: 'about us',
      key: 'about-us',
      icon: <InfoCircleOutlined rev />,
      onClick: () => {
        navigate('/about-us');
      },
    },
  ];
  const { Header } = Layout;

  return (
    <Header
      style={{
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'inherit',
        paddingInline: '1em',
        padding: 0,
      }}
    >
      <Row
        style={{
          width: '100%',
        }}
      >
        <Col span={6}>
          <img src={LOGO} style={{ width: '12em', height: '3em' }} />
        </Col>
        <Col span={12}>
          <Menu
            style={{
              width: '100%',
              backgroundColor: 'inherit',
            }}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            defaultSelectedKeys={['home']}
          />
        </Col>
        <Col span={6}>
          {userName ?? <span>{userName}</span>}
          {userIsLoggedIn() ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={goToLoginPage}>Login</button>
          )}
          <Avatar gap={8} src={user?.pictureUrl} alt={`${userName}`}>
            <UserOutlined rev />
          </Avatar>
          {/* <div style={userInfoStyle}>
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
          </div> */}
        </Col>
      </Row>
    </Header>
  );
};

export default Header;
