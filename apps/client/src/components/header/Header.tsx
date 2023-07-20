import LOGO from '../../assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  setUser,
  userIsLoggedIn,
} from '../../store/reducers/userSlice';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { FC, useState } from 'react';
import { Col, Layout, Menu, MenuProps, Row } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import './Header.less';
import { useNavigation } from '../../hooks/navigate';

const Header: FC = () => {
  const user = useSelector(getUser);
  const [, , removeCookie] = useCookies(['user']);
  const dispatch = useDispatch();
  const {
    goToHomePage,
    goToLoginPage,
    goToAboutUsPage: goToToAboutUsPage,
    goToMyEventsPage: goToToMyEventsPage,
    goToSharedEventsPage: goToToSharedEventsPage,
  } = useNavigation();

  const logout = () => {
    dispatch(setUser({}));
    goToHomePage();
    removeCookie('user', { path: '/' });
  };

  const userName = user?.fullName
    ? `${user.firstName} ${user.lastName}`
    : 'אורח';

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
      onClick: goToHomePage,
    },
    {
      label: 'My events',
      key: 'my-events',
      icon: <ShareAltOutlined rev />,
      onClick: goToToMyEventsPage,
    },
    {
      label: 'shared events',
      key: 'shared-events',
      icon: <ShareAltOutlined rev />,
      onClick: goToToSharedEventsPage,
    },
    {
      label: 'about us',
      key: 'about-us',
      icon: <InfoCircleOutlined rev />,
      onClick: goToToAboutUsPage,
    },
  ];

  return (
    <Layout.Header
      style={{
        backgroundColor: 'inherit',
        padding: '1em',
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
        </Col>
      </Row>
    </Layout.Header>
  );
};

export default Header;
