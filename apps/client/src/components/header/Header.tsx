import LOGO from '../../assets/logo.png';
import Avatar from 'antd/es/avatar/avatar';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  setUser,
  userIsLoggedIn,
} from '../../store/reducers/userSlice';
import { useCookies } from 'react-cookie';
import { FC, useState } from 'react';
import { Layout, Menu, MenuProps, Space, Tooltip } from 'antd';
import {
  CarryOutOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigation } from '../../hooks/navigate';
import './Header.less';

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

  const userName = `${user.firstName ?? 'guest'}`;

  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuProps['items'] = [
    {
      label: <span className="menu-item-label">home</span>,
      key: 'home',
      icon: (
        <Tooltip title="home">
          <HomeOutlined rev={undefined} />
        </Tooltip>
      ),
      onClick: goToHomePage,
    },
    {
      label: <span className="menu-item-label">My events</span>,
      key: 'my-events',
      icon: (
        <Tooltip title="my-events">
          <CarryOutOutlined rev={undefined} title="my-events" />
        </Tooltip>
      ),
      onClick: goToToMyEventsPage,
    },
    {
      label: <span className="menu-item-label">Shared events</span>,
      key: 'shared-events',
      icon: (
        <Tooltip title="shared-events">
          <ShareAltOutlined rev={undefined} />
        </Tooltip>
      ),
      onClick: goToToSharedEventsPage,
    },
    {
      label: <span className="menu-item-label">about us</span>,
      key: 'about-us',
      icon: (
        <Tooltip title="about-us">
          <InfoCircleOutlined rev={undefined} />
        </Tooltip>
      ),
      onClick: goToToAboutUsPage,
    },
  ];

  return (
    <Layout.Header
      className="menu-header-con"
      style={{
        backgroundColor: 'inherit',
        padding: '1em',
        height: 'auto',
      }}
    >
      <div className="top" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={LOGO} style={{ height: '4em' }} />
        <Menu
          style={{
            flexGrow: 1,
            backgroundColor: 'inherit',
          }}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          defaultSelectedKeys={['home']}
        />
        <div
          className="user"
          style={{ display: 'flex', alignItems: 'center', marginRight: '1em' }}
        >
          <Space>
            <p>{userName}</p>
            <Avatar gap={8} src={user?.pictureUrl} alt={`${userName}`}>
              <UserOutlined rev={undefined} />
            </Avatar>
            <Tooltip title={userIsLoggedIn() ? 'logout' : 'login'}>
              <img
                style={{
                  height: '1.5em',
                  transform: !userIsLoggedIn() ? 'scaleX(-1)' : 'none',
                  marginTop: '0.3em',
                }}
                src={'../../assets/logout.png'}
                onClick={userIsLoggedIn() ? logout : goToLoginPage}
              />
            </Tooltip>
          </Space>
        </div>
      </div>
    </Layout.Header>
  );
};

export default Header;
