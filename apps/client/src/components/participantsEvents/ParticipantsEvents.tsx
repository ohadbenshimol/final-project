import defaultImg from '../../assets/default.svg';
import {eventsRef, usersRef} from '../../helpers/firebase';
import {FC, useEffect, useState} from 'react';
import {equalTo, get, onValue, orderByChild, query} from 'firebase/database';
import {Card, Image, Modal} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {getUser, getUserID, UserState} from '../../store/reducers/userSlice';
import {NewEvent} from '../../shared/models/event';
import {useQuery} from 'react-query';
import {debounce} from 'ts-debounce';
import {useCookies} from 'react-cookie';
import {ShareEvent} from '../shareEvent/ShareEvent';
import {Row, Skeleton, Tooltip} from 'antd';
import {UsersPhotos} from '../ownerEvents/OwnerEvents';
import {CarryOutOutlined, CloudUploadOutlined, FormOutlined, ShareAltOutlined,} from '@ant-design/icons';
import './ParticipantsEvents.less';
import {useNavigation} from '../../hooks/navigate';

interface ParticipantsEventsProps {}

const ParticipantsEvents: FC<ParticipantsEventsProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [participantsEvents, setParticipantsEvents] =
    useState<Record<string, NewEvent>>();
  const [filteredEvents, setFilteredEvents] =
    useState<Record<string, NewEvent>>();
  const [users, setUsers] = useState<Record<string, UserState>>();
  const { goToLoginPage, goToUploadFilePage } = useNavigation('/shared-events');
  const [cookies] = useCookies(['user']);
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
            <Row
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
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
                                onClick={() => goToUploadFilePage(id)}
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

      {loading && <Card.Group centered>{loadingCards}</Card.Group>}

      {participantsEvents && Object.keys(participantsEvents)?.length < 1 && (
        <div className="empty">there isnt shared event yet</div>
      )}
    </>
  );
};

export default ParticipantsEvents;
