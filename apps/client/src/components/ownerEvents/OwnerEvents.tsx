import {db, eventsRef, usersRef} from '../../helpers/firebase';
import {FC, useEffect, useState} from 'react';
import {equalTo, get, onValue, orderByChild, query, ref, update} from 'firebase/database';
import {Button, Container, Grid, Icon, Label, Segment} from 'semantic-ui-react';
import {useSelector} from 'react-redux';
import {getUserID, UserState} from '../../store/reducers/userSlice';
import {Link} from 'react-router-dom';
import {NewEvent} from '../../shared/models/event';
import {useQuery} from 'react-query';
import userIMAGE from '../../assets/user.png';
import styled from 'styled-components';

import './OwnerEvents.less';
import {CLIENT_URL} from '../../helpers/config';
import {debounce} from "ts-debounce";

interface OwnerEventsProps {
}

export const OwnerEvents: FC<OwnerEventsProps> = () => {
  const userID = useSelector(getUserID);
  const [ownerEvents, setOwnerEvents] = useState<Record<string, NewEvent>>();
  const [fIlteredEvents, setFIlteredEvents] = useState<Record<string, NewEvent>>();
  const [users, setUsers] = useState<Record<string, UserState>>();
  useQuery('das', () => get(query(usersRef)), {
    onError: console.error,
    onSuccess: (data) => setUsers(data.val()),
  });

  useEffect(() => {
    const eventQuery = query(
      eventsRef,
      orderByChild(`owner`),
      equalTo(userID!)
    );

    onValue(eventQuery, (snapshot) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID =
        data &&
        Object.fromEntries(
          Object.entries(data).filter(([k, event]) => event.owner === userID)
        );
      setOwnerEvents(EventsByUserID);
      setFIlteredEvents(EventsByUserID);
      console.log('events that i am participant', data);
    });
  }, [userID]);

  const handleInputChange = (event: any) => {
    const filteredEvent = Object.fromEntries(
      Object.entries(ownerEvents!).filter(([k, newEvent]) =>
        newEvent.name.toLowerCase().includes(event.target.value))
    );

    setFIlteredEvents(filteredEvent)
  }

  const debaunce = debounce(handleInputChange, 300)

  const getEvent = async (eventId: string) => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    return snapshot.val();
  };

  const endEvent = async (eventId: string) => {
    console.log(eventId)
    //TODO: send request to server
    const event: NewEvent = await getEvent(eventId);
    if (event) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        isActive: false
      })

    }
  }
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
    <><Container>
      <div className="ui icon input">
        <input type="text" placeholder="Search..." onKeyUp={debaunce}/><i aria-hidden="true"
                                                                          className="search icon"></i>
      </div>
      {ownerEvents && (
        <>
          <h2 style={{textAlign: 'center'}}>Created Events</h2>
          <Grid columns={3}>
            {Object.entries(fIlteredEvents!)?.map(
              ([id, event]: [string, NewEvent], index) =>
                (
                  <Grid.Row key={index}>
                    <Grid.Column width={4}>
                      <img className={"ui tiny image"}
                      src={event.imgUrl || "../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg"}/>
                    </Grid.Column>

                    <Grid.Column width={8}>
                      <p>{event.name}</p>
                      <p>{event.description}</p>
                      <p>{event.creationDate}</p>
                      <label>
                        מס משתתפים: {Object.keys(event.subscribers).length}
                      </label>
                      <p>{id}</p>
                      <UsersPhotos
                        subscribers={event.subscribers}
                        users={users}/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {event.isActive ? (<Link to={`/uploadFile/${id}`}>
                        <i className="images outline icon"/>
                      </Link>) : (<p></p>)}
                      <Button animated onClick={() => endEvent(id)}>
                        <Button.Content visible>end event</Button.Content>
                        <Button.Content hidden>
                          <Icon name='remove'/>
                        </Button.Content>
                      </Button>
                      <Button
                        onClick={() => shareClick(`${CLIENT_URL}/register-event/${id}`)}
                      >
                        <i className="share alternate icon"/>{' '}
                      </Button>
                    </Grid.Column>

                  </Grid.Row>
                )
            )}
          </Grid>
        </>
      )}
    </Container>
      {/*<Grid columns={2}>*/}
      {/*  <Grid.Column>*/}
      {/*    <Segment raised>*/}
      {/*      <Label as='a' color='red' ribbon>*/}
      {/*        Overview*/}
      {/*      </Label>*/}
      {/*      <span>Account Details</span>*/}

      {/*      <img src='../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg'/>*/}

      {/*      <Label as='a' color='blue' ribbon>*/}
      {/*        Community*/}
      {/*      </Label>*/}
      {/*      <span>User Reviews</span>*/}

      {/*      <img src='../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg'/>*/}
      {/*    </Segment>*/}
      {/*  </Grid.Column>*/}

      {/*  <Grid.Column>*/}
      {/*    <Segment>*/}
      {/*      <Label as='a' color='orange' ribbon='right'>*/}
      {/*        Specs*/}
      {/*      </Label>*/}
      {/*      <img src='../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg'/>*/}


      {/*      <Label as='a' color='teal' ribbon='right'>*/}
      {/*        Reviews*/}
      {/*      </Label>*/}
      {/*      <img src='../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg'/>*/}
      {/*    </Segment>*/}
      {/*  </Grid.Column>*/}
      {/*</Grid>*/}
    </>
  );
};

const Avatar = styled.img`
  width: 2em;
  border-radius: 50%;
  margin-right: -1em;
`;

const MoreIndicator = styled.div`
  width: 2.85em;
  height: 2.85em;
  border-radius: 50%;
  background-color: #888;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
`;

interface UsersPhotosProps {
  subscribers: Record<string, boolean>;
  users?: Record<string, UserState>;
}

const UsersPhotos: FC<UsersPhotosProps> = ({subscribers, users}) => {
  const ids = Object.keys(subscribers);
  const [maxAvatarsToShow, setMaxAvatarsToShow] = useState(2);
  const handleImageError = (e: any) => {
    e.target.src = userIMAGE;
  };
  const moreAvatarsCount = Object.values(subscribers).length - maxAvatarsToShow;

  const toggleUsers = () => {
    setMaxAvatarsToShow(Object.values(subscribers).length + 1); //TODO:toggle back users
  };

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center'}}>
        {users &&
          Object.entries(users)
            .slice(0, maxAvatarsToShow + 1)
            ?.filter(([k, v]) => ids.includes(k))
            .map(([k, v], index) => (
              <Avatar
                key={index}
                title={`${v.firstName} ${v.lastName}`}
                src={v.pictureUrl}
                onError={handleImageError}
                onClick={() => navigator.clipboard.writeText(k)}
              />
            ))}

        {moreAvatarsCount > 0 && (
          <MoreIndicator onClick={toggleUsers}>
            +{moreAvatarsCount}
          </MoreIndicator>
        )}
      </div>
    </>
  );
};
