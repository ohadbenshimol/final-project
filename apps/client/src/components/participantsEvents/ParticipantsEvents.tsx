import { db, eventsRef, usersRef } from '../../helpers/firebase';
import { FC, useEffect, useState } from 'react';
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from 'firebase/database';
import { Card, Image, Modal } from 'semantic-ui-react';
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
import { Col, Row, Skeleton, Tooltip } from 'antd';
import {
  AppstoreAddOutlined,
  CarryOutOutlined,
  CloudUploadOutlined,
  FormOutlined,
  MinusCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import './ParticipantsEvents.less';
import { UsersPhotos } from '../ownerEvents/OwnerEvents';
interface ParticipantsEventsProps {}

const ParticipantsEvents: FC<ParticipantsEventsProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [participantsEvents, setParticipantsEvents] =
    useState<Record<string, NewEvent>>();
  const [filteredEvents, setFilteredEvents] =
    useState<Record<string, NewEvent>>();
  const [users, setUsers] = useState<Record<string, UserState>>();
  const navigate = useNavigate();
  const [cookies] = useCookies(['user']);
  const [createEventIsOpen, setCreateEventIsOpen] = useState(false);
  const [shareEventOpen, setShareEventOpen] = useState(false);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      navigate('/login', { state: { from: 'shared-events' } });
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
    const eventQuery = query(
      eventsRef,
      orderByChild(`subscribers/${userID}`),
      equalTo(true)
    );

    onValue(eventQuery, (snapshot) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID =
        data &&
        Object.fromEntries(
          Object.entries(data).filter(([k, event]) => event.owner !== userID)
        );
      setLoading(false);
      setParticipantsEvents(EventsByUserID);
      setFilteredEvents(EventsByUserID);
    });
  }, [userID]);

  const handleInputChange = (event: any) => {
    const filteredEvent = Object.fromEntries(
      Object.entries(participantsEvents!).filter(([id, newEvent]) => {
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
    //TODO: send request to server

    const event: NewEvent = await getEvent(eventId);
    if (event) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        isActive: false,
      });
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

  const a = new Array(15).fill(null).map((_, index) => {
    return (
      <Card key={index}>
        <Skeleton.Image active style={{ width: '100%', height: '14em' }} />
        <Card.Content>
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
        </Card.Content>
        <Card.Content extra>
          <div className="c">
            <div className="cc">
              <Skeleton.Avatar active />
              <Skeleton.Avatar active />
              <Skeleton.Avatar active />
            </div>

            <div className="buttons">
              <ShareAltOutlined rev onClick={shareClick} />
              <FormOutlined rev />
              <CloudUploadOutlined rev />
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  });

  return (
    <>
      {participantsEvents && Object.keys(participantsEvents)?.length > 0 && (
        <>
          <Card.Group centered>
            <Row style={{ width: '100%' }}>
              <div className="ui icon input">
                <input
                  type="text"
                  placeholder="enter event id or name"
                  onKeyUp={debounceInputChange}
                />
                <i
                  aria-hidden="true"
                  className="search icon"
                  style={{ color: 'var(--main-color)', opacity: 0.9 }}
                />
              </div>
            </Row>
            {Object.entries(filteredEvents!)?.map(
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
                      <Card.Description>{id}</Card.Description>
                      <Card.Description>
                        "ds"{event.isActive ? 'Active' : 'not'}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="c">
                        <UsersPhotos
                          subscribers={event.subscribers}
                          users={users}
                        />
                        <div className="buttons">
                          <Tooltip title="share">
                            <ShareAltOutlined rev onClick={shareClick} />
                          </Tooltip>

                          {event.isActive ? (
                            <Tooltip title="upload images">
                              <CloudUploadOutlined
                                rev
                                onClick={() => navigate(`/uploadFile/${id}`)}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="event is finish">
                              <CarryOutOutlined rev />
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

      {loading && <Card.Group centered>{a}</Card.Group>}

      {participantsEvents && Object.keys(participantsEvents)?.length < 1 && (
        <div className="empty">there isnt shared event yet</div>
      )}

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

export default ParticipantsEvents;

// import { useSelector } from 'react-redux';
// import { getUser, getUserID } from '../../store/reducers/userSlice';
// import { FC, useEffect, useState } from 'react';
// import { NewEvent } from '../../shared/models/event';
// import { equalTo, onValue, orderByChild, query } from 'firebase/database';
// import { eventsRef } from '../../helpers/firebase';
// import { Button, Container, Grid } from 'semantic-ui-react';
// import './ParticipantsEvents.less';
// import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';

// export interface ParticipantsProps {}

// export const ParticipantsEvents: FC<ParticipantsProps> = ({}) => {
//   const userID = useSelector(getUserID);
//   const user = useSelector(getUser);
//   const navigate = useNavigate();
//   const [participantsEvents, setParticipantsEvents] = useState<NewEvent[]>([]);

//   const [cookies] = useCookies(['user']);

//   useEffect(() => {
//     if (!(user.email && cookies.user.email)) {
//       navigate('/login', { state: { from: 'shared-events' } });
//     } else {
//       // toast.success(`user store , ${user.email}`);
//       // toast.success(`user cookie , ${cookies.user.email}`);
//     }
//   }, [user, cookies]);

//   useEffect(() => {
//     const eventQuery = query(
//       eventsRef,
//       orderByChild(`subscribers/${userID}`),
//       equalTo(true)
//     );

//     onValue(eventQuery, (snapshot) => {
//       const data = snapshot.val() as Record<string, NewEvent>;
//       const EventsByUserID: NewEvent[] =
//         data && Object.values(data).filter((event) => event.owner !== userID);
//       setParticipantsEvents(EventsByUserID);
//     });
//   }, [userID]);

//   return (
//     <>
//       {participantsEvents && (
//         <>
//           {Object.values(participantsEvents).length ? (
//             <Grid columns={3}>
//               {Object.values(participantsEvents).map(
//                 (event: NewEvent, index) => (
//                   <Grid.Row key={index}>
//                     <Grid.Column width={4}>
//                       <img
//                         className="ui tiny image"
//                         src="../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg"
//                       />
//                     </Grid.Column>
//                     <Grid.Column width={8}>
//                       <p>{event.name}</p>
//                       <p>{event.description}</p>
//                       <p>{event.creationDate}</p>
//                     </Grid.Column>
//                     <Grid.Column width={4}>
//                       <Button primary>Edit event</Button>
//                       <Button>Details</Button>
//                     </Grid.Column>
//                   </Grid.Row>
//                 )
//               )}
//             </Grid>
//           ) : (
//             <div className="empty">
//               <h1>there is no events that shares with you yet.</h1>
//               <h1>but don't worry we are here for you</h1>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };
