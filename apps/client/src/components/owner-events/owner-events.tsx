import { useSelector } from 'react-redux';
import { getUserID } from '../../store/reducers/userSlice';
import { FC, useEffect, useState } from 'react';
import { NewEvent } from '../../shared/models/event';
import { equalTo, onValue, orderByChild, query } from 'firebase/database';
import { eventsRef } from '../../helpers/firebase';
import { Button, Container, Grid } from 'semantic-ui-react';

export interface ParticipantsProps {}

export const ParticipantsEvents: FC<ParticipantsProps> = ({}) => {
  const userID = useSelector(getUserID);

  const [participantsEvents, setParticipantsEvents] = useState<NewEvent[]>([]);

  useEffect(() => {
    const eventQuery = query(
      eventsRef,
      orderByChild(`subscribers/${userID}`),
      equalTo(true)
    );

    onValue(eventQuery, (snapshot) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID: NewEvent[] =
        data && Object.values(data).filter((event) => event.owner !== userID);
      setParticipantsEvents(EventsByUserID);
      console.log('events that i am participant', data);
    });
  }, [userID]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Container>
        {participantsEvents && (
          <>
            <h2 className="owner-event-title" style={{ textAlign: 'center' }}>
              Events that you join
            </h2>
            <Grid columns={3}>
              {Object.values(participantsEvents)?.map(
                (event: NewEvent, index) => (
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
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Button primary>Edit event</Button>
                      <Button>Details</Button>
                    </Grid.Column>
                  </Grid.Row>
                )
              )}
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default ParticipantsEvents;
