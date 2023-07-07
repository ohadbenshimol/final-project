import { eventsRef, usersRef } from '../../helpers/firebase';
import { FC, useEffect, useState } from 'react';
import { equalTo, get, onValue, orderByChild, query } from 'firebase/database';
import { Button, Container, Grid } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { UserState, getUserID } from '../../store/reducers/userSlice';
import { Link } from 'react-router-dom';
import { NewEvent } from '../../shared/models/event';
import { useQuery } from 'react-query';
import userIMAGE from '../../assets/user.png';
import './OwnerEvents.less';
import { CLIENT_URL } from '../../helpers/config';

interface OwnerEventsProps {}

export const OwnerEvents: FC<OwnerEventsProps> = () => {
  const userID = useSelector(getUserID);
  const [ownerEvents, setOwnerEvents] = useState<Record<string, NewEvent>>();
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
      console.log('events that i am participant', data);
    });
  }, [userID]);

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
    <Container>
      {ownerEvents && (
        <>
          <h2 style={{ textAlign: 'center' }}>Created Events</h2>
          <Grid columns={3}>
            {Object.entries(ownerEvents)?.map(
              ([id, event]: [string, NewEvent], index) => (
                <Grid.Row key={index}>
                  <Grid.Column width={4}>
                    <img
                      className="ui tiny image"
                      src="../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg"
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <p>{event.name}</p>
                    <p>{event.description}</p>
                    <p>{event.url}</p>
                    <p>{event.creationDate}</p>
                    <label>
                      מס משתתפים: {Object.keys(event.subscribers).length}
                    </label>

                    <UsersPhotos
                      subscribers={event.subscribers}
                      users={users}
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Link to={`/uploadFile/${id}`}>
                      <i className="images outline icon" />
                    </Link>
                    <Button>
                      <i className="sliders horizontal icon" />{' '}
                    </Button>
                    <Button
                      onClick={() =>
                        shareClick(`${CLIENT_URL}/register-event/${id}`)
                      }
                    >
                      <i className="share alternate icon" />{' '}
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              )
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

interface UsersPhotosProps {
  subscribers: Record<string, boolean>;
  users?: Record<string, UserState>;
}
const UsersPhotos: FC<UsersPhotosProps> = ({ subscribers, users }) => {
  const ids = Object.keys(subscribers);
  const handleImageError = (e: any) => {
    e.target.src = userIMAGE;
  };
  return (
    <>
      {users &&
        Object.entries(users)
          ?.filter(([k, v]) => ids.includes(k))
          .map(([k, v]) => (
            <img
              title={`${v.firstName} ${v.lastName}`}
              style={{ width: '2em', borderRadius: '50%' }}
              src={v.pictureUrl}
              onError={handleImageError}
              onClick={() => navigator.clipboard.writeText(k)}
            />
          ))}
    </>
  );
};
