import userIMAGE from '../../assets/user.png';
import { db, eventsRef, usersRef } from '../../helpers/firebase';
import { FC, useEffect, useRef, useState } from 'react';
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from 'firebase/database';
import { Button, Card, Image, Icon, Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser, getUserID, UserState } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { NewEvent } from '../../shared/models/event';
import { useQuery } from 'react-query';
import { debounce } from 'ts-debounce';
import { useCookies } from 'react-cookie';
import { CreateEvent } from '../createEvent/CreateEvent';
import { ShareEvent } from '../shareEvent/ShareEvent';
import defaultImg from '../../assets/default.svg';
import { Avatar } from 'antd';
import { ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import './OwnerEvents.less';
interface OwnerEventsProps {}

export const OwnerEvents: FC<OwnerEventsProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [ownerEvents, setOwnerEvents] = useState<Record<string, NewEvent>>();
  const [fIlteredEvents, setFIlteredEvents] =
    useState<Record<string, NewEvent>>();
  const [users, setUsers] = useState<Record<string, UserState>>();
  const navigate = useNavigate();
  const [cookies] = useCookies(['user']);
  const [createEventIsOpen, setCreateEventIsOpen] = useState(false);
  const [shareEventOpen, setShareEventOpen] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      navigate('/', { state: { from: '/own-events' } });
    } else {
      // toast.success(`user store , ${user.email}`);
      // toast.success(`user cookie , ${cookies.user.email}`);
    }
  }, [user, cookies]);

  useQuery('users', () => get(query(usersRef)), {
    onError: console.error,
    onSuccess: (data) => setUsers(data.val()),
  });

  const onSubmit = () => {
    setCreateEventIsOpen(false);
    setShareEventOpen(true);
  };

  const onCancel = () => {
    setCreateEventIsOpen(false);
  };

  const onClickAddEvent = () => setCreateEventIsOpen(true);

  useEffect(() => {
    if (!userID) return;
    const eventQuery = query(eventsRef, orderByChild(`owner`), equalTo(userID));

    onValue(eventQuery, (snapshot) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID =
        data &&
        Object.fromEntries(
          Object.entries(data).filter(([k, event]) => event.owner === userID)
        );
      setOwnerEvents(EventsByUserID);
      setFIlteredEvents(EventsByUserID);
    });
  }, [userID]);

  const handleInputChange = (event: any) => {
    const filteredEvent = Object.fromEntries(
      Object.entries(ownerEvents!).filter(([k, newEvent]) =>
        newEvent.name.toLowerCase().includes(event.target.value)
      )
    );

    setFIlteredEvents(filteredEvent);
  };

  const debounceInputChange = debounce(handleInputChange, 300);

  const getEvent = async (eventId: string) => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    return snapshot.val();
  };

  const endEvent = async (eventId: string) => {
    console.log(eventId);
    //TODO: send request to server
    const event: NewEvent = await getEvent(eventId);
    if (event) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        isActive: false,
      });
    }
  };

  const shareClick = (link: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Only me',
        text: 'Register my event',
        url: link,
      });
    } else {
      console.log('Share not supported on this browser, do it manually!');
    }
  };

  return (
    <>
      <div className="ui icon input">
        <input
          type="text"
          placeholder="Search..."
          onKeyUp={debounceInputChange}
        />
        <i aria-hidden="true" className="search icon"></i>
      </div>
      {ownerEvents && (
        <>
          <Card.Group>
            {Object.entries(fIlteredEvents!)?.map(
              ([id, event]: [string, NewEvent], index) => (
                <>
                  <Card>
                    <Image
                      className="Sad"
                      style={{ height: '21em' }}
                      src={event.imgUrl || defaultImg}
                      fluid
                      ui={false}
                    />
                    <Card.Content>
                      <Card.Header>{event.name}</Card.Header>
                      <Card.Meta>
                        <span className="date">{event.creationDate}</span>
                      </Card.Meta>
                      <Card.Description>{event.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="c">
                        <UsersPhotos
                          subscribers={event.subscribers}
                          users={users}
                        />
                        <div className="buttons">
                          <ShareAltOutlined rev />
                          <Icon name="remove" />
                          <Icon name="remove circle" />
                          <Icon name="edit" />
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </>
              )
            )}
          </Card.Group>
        </>
      )}
      <Button
        className="ui green button"
        icon="add"
        size="huge"
        circular
        style={{ position: 'fixed', bottom: '0', right: '0' }}
        onClick={onClickAddEvent}
      />
      <Modal
        open={createEventIsOpen}
        onClose={() => setCreateEventIsOpen(true)}
      >
        <CreateEvent
          onCancel={onCancel}
          setLink={setLink}
          onSubmit={onSubmit}
        />
      </Modal>
      <Modal open={shareEventOpen} onClose={() => setShareEventOpen(false)}>
        <ShareEvent link={link} />
      </Modal>
    </>
  );
};

interface UsersPhotosProps {
  subscribers: Record<string, boolean>;
  users?: Record<string, UserState>;
}

const UsersPhotos: FC<UsersPhotosProps> = ({ subscribers, users }) => {
  const ids = Object.keys(subscribers);
  const a = useRef<any>();
  const handleImageError = () => {
    if (a) (a as any).target.src = userIMAGE;
    return false;
  };
  const maxCount = 4;

  return (
    <Avatar.Group
      maxCount={maxCount}
      maxPopoverPlacement={'bottom'}
      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
    >
      {users &&
        Object.entries(users)
          // ?.filter(([k, v]) => ids.includes(k))//TODO
          .map(([k, v], index) => (
            <>
              <Avatar
                ref={a}
                gap={8}
                onError={() => {
                  // e.target.src = '../../assets/user.png';
                  // e.target.src = <UserOutlined rev />;//TODO
                  return true;
                }}
                icon={
                  <img
                    onError={(e: any) => {
                      e.target.src = '../../assets/user.png';
                      // e.target.src = <UserOutlined rev />; //TODO
                      return true;
                    }}
                    src={v.pictureUrl}
                    onClick={() => console.log('sdsd')}
                  />
                }
                key={index}
                alt={`${v.firstName} ${v.lastName}`}
              >
                <UserOutlined rev />
              </Avatar>
            </>
          ))}
    </Avatar.Group>
  );
};
