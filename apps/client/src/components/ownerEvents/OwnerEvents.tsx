import userIMAGE from '../../assets/user.png';
import {db, eventsRef, usersRef} from '../../helpers/firebase';
import {FC, useEffect, useRef, useState} from 'react';
import {equalTo, get, onValue, orderByChild, query, ref, update,} from 'firebase/database';
import {Card, Image} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {getUser, getUserID, UserState} from '../../store/reducers/userSlice';
import {NewEvent} from '../../shared/models/event';
import {useQuery} from 'react-query';
import {debounce} from 'ts-debounce';
import {useCookies} from 'react-cookie';
import defaultImg from '../../assets/default.svg';
import {Avatar, Col, Modal, Row, Skeleton, Tooltip} from 'antd';
import {
  AppstoreAddOutlined,
  CarryOutOutlined,
  CloudUploadOutlined,
  FormOutlined,
  MinusCircleOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './OwnerEvents.less';
import {closeEvent} from '../../helpers/requests';
import {useNavigation} from '../../hooks/navigate';
import CreateNewEvent from "../createNewEvent/createNewEvent";
import {Fade} from "react-awesome-reveal";

interface OwnerEventsProps {
}

export const OwnerEvents: FC<OwnerEventsProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [ownerEvents, setOwnerEvents] = useState<Record<string, NewEvent>>();
  const [fIlteredEvents, setFilteredEvents] = useState<Record<string, NewEvent>>();
  const [users, setUsers] = useState<Record<string, UserState>>();
  const {goToLoginPage, goToUploadFilePage} = useNavigation('/own-events');
  const [cookies] = useCookies(['user']);
  const [current, setCurrent] = useState(0);


  const [createEventIsOpen, setCreateEventIsOpen] = useState(false);
  const [shareEventOpen, setShareEventOpen] = useState(false);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      goToLoginPage();
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
      setLoading(false);
      setOwnerEvents(EventsByUserID);
      setFilteredEvents(EventsByUserID);
    });
  }, [userID]);

  const handleInputChange = (event: any) => {
    const filteredEvent = Object.fromEntries(
      Object.entries(ownerEvents!).filter(([id, newEvent]) => {
        const lowerCaseInput = event.target.value?.toLowerCase();
        return (
          newEvent.name.toLowerCase().includes(lowerCaseInput) ||
          id?.toLowerCase().includes(lowerCaseInput)
        );
      })
    );
    setFilteredEvents(filteredEvent);
  };

  const debounceInputChange = debounce(handleInputChange, 300);

  const getEvent = async (eventId: string) => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    return snapshot.val();
  };

  const endEvent = async (eventId: string) => {
    console.log(eventId);

    const event: NewEvent = await getEvent(eventId);
    if (event) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        isActive: false,
      });

      await closeEvent({eventId});
    }
  };

  const shareClick = () => {
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

  const loadingCards = new Array(15).fill(null).map((_, index) => {
    return (
      <Card key={index}>
        <Skeleton.Image active style={{width: '100%', height: '14em'}}/>
        <Card.Content>
          <Skeleton.Input active style={{marginBottom: '0.2em'}}/>
          <Skeleton.Input active style={{marginBottom: '0.2em'}}/>
          <Skeleton.Input active style={{marginBottom: '0.2em'}}/>
        </Card.Content>
        <Card.Content extra>
          <div className="c">
            <div className="avatars">
              <Skeleton.Avatar active/>
              <Skeleton.Avatar active/>
              <Skeleton.Avatar active/>
            </div>

            <div className="buttons">
              <ShareAltOutlined rev onClick={shareClick}/>
              <FormOutlined rev/>
              <CloudUploadOutlined rev/>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  });
  return (
    <>
      {ownerEvents && (
        <>
          <Card.Group centered>
            <Row className="temp">
              <Col>
                <Tooltip title="create new event">
                  <AppstoreAddOutlined
                    rev
                    style={{
                      fontSize: '2.2em',
                      borderColor: 'var(--main-color)',
                      borderRadius: '20%',
                      borderWidth: '4px',
                    }}
                    onClick={onClickAddEvent}
                  />
                </Tooltip>
              </Col>
              <Col>
                <div className="ui icon input">
                  <input
                    type="text"
                    placeholder="enter event id or name"
                    onKeyUp={debounceInputChange}
                  />
                  <i
                    aria-hidden="true"
                    className="search icon"
                    style={{color: 'var(--main-color)', opacity: 0.9}}
                  />
                </div>
              </Col>


            </Row>
            {Object.entries(fIlteredEvents!)?.map(
              ([id, event]: [string, NewEvent], index) => (
                <>
                  <Card>
                    <Image
                      className="Sad"
                      style={{height: '21em'}}
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
                      <Card.Description>{id}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="c">
                        <UsersPhotos
                          subscribers={event.subscribers}
                          users={users}
                        />
                        <div className="buttons">
                          <Tooltip title="share">
                            <ShareAltOutlined rev onClick={shareClick}/>
                          </Tooltip>
                          <Tooltip title="upload images">
                            <CloudUploadOutlined
                              rev
                              onClick={() => goToUploadFilePage(id)}
                            />
                          </Tooltip>
                          {event.isActive ? (
                            <Tooltip title="end event">
                              <MinusCircleOutlined
                                rev
                                onClick={() => endEvent(id)}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="event is finish">
                              <CarryOutOutlined rev/>
                            </Tooltip>
                          )}
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

      {loading && <Card.Group centered>{loadingCards}</Card.Group>}
      {fIlteredEvents && Object.values(fIlteredEvents!)?.length === 0 && (
        <Row>
          <Fade
            direction="right"
            duration={30}
            cascade
            style={{ fontSize: '2em' }}
            className={"not-found-message"}
          >
            Sorry, we couldn't find the event you were looking for...
          </Fade>
        </Row>
      )}
      {ownerEvents && Object.keys(ownerEvents)?.length < 1 && (
        <div className="empty">
          there isnt event yet click the button to create one ={'>'}
          <Tooltip title="create new event">
            <AppstoreAddOutlined
              rev
              style={{
                fontSize: '2.2em',
                borderColor: 'var(--main-color)',
                borderRadius: '20%',
                borderWidth: '2px',
              }}
              onClick={onClickAddEvent}
            />
          </Tooltip>
        </div>
      )}

      <Modal
        footer={null}
        okButtonProps={{disabled: true}}
        cancelButtonProps={{disabled: true}}
        width={860}
        title="Create new event"
        centered
        open={createEventIsOpen}
        onOk={() => setCreateEventIsOpen(false)}
        onCancel={() => {
          setCurrent(0)
          setCreateEventIsOpen(false);
        }}
      >
        <CreateNewEvent setCreateEventIsOpen={setCreateEventIsOpen} setCurrent={setCurrent}
                        current={current}></CreateNewEvent>
      </Modal>
    </>
  );
};

interface UsersPhotosProps {
  subscribers: Record<string, boolean>;
  users?: Record<string, UserState>;
}

//TODO move
export const UsersPhotos: FC<UsersPhotosProps> = ({subscribers, users}) => {
  const ids = Object.keys(subscribers);
  const a = useRef<any>();
  const handleImageError = () => {
    if (a) (a as any).target.src = userIMAGE;
    return false;
  };
  const maxCount = 4;

  return (
    <>
      <Avatar.Group
        maxCount={maxCount}
        maxPopoverPlacement={'bottom'}
        maxStyle={{color: '#f56a00', backgroundColor: '#fde3cf'}}
      >
        {users &&
          Object.entries(users)
            ?.filter(([k, v]) => ids.includes(k)) //TODO
            .map(([k, v], index) => (
              <>
                <Avatar
                  ref={a}
                  gap={8}
                  icon={<img
                    style={{display: 'block'}}
                    onError={(e: any) => {
                      e.target.src = '../../assets/user.png';
                      // e.target.src = <UserOutlined rev />; //TODO
                      return true;
                    }}
                    src={v.pictureUrl}
                    onClick={() => console.log('sdsd')}/>}
                  key={index}
                  alt={`${v.firstName} ${v.lastName}`}
                >
                  <UserOutlined rev/>
                </Avatar>
              </>
            ))}
      </Avatar.Group></>
  );
};
