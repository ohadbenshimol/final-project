import * as Yup from 'yup';
import { eventsRef } from '../../helpers/firebase';
import { FC, useEffect, useRef, useState } from 'react';
import { equalTo, onValue, orderByChild, query } from 'firebase/database';
import { Button, Container, Grid, Modal, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser, getUserID } from '../../store/reducers/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { NewEvent } from '../../shared/models/event';
import { useCookies } from 'react-cookie';
import ParticipantsEvents from '../owner-events/owner-events';
import { CreateEvent } from '../createEvent/CreateEvent';
import './events.less';
import { ShareEvent } from '../shareEvent/ShareEvent';

interface LoginProps {}

export const Events: FC<LoginProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [ownerEvents, setOwnerEvents] = useState<NewEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(['user']);
  const [shareEventOpen, setShareEventOpen] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    const eventQuery = query(
      eventsRef,
      orderByChild(`owner`),
      equalTo(userID!)
    );

    onValue(eventQuery, (snapshot) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID: NewEvent[] =
        data && Object.values(data).filter((event) => event.owner === userID);
      setOwnerEvents(EventsByUserID);
      console.log('events that i am participant', data);
    });
  }, [userID]);

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      navigate('/', { state: { from: '/events' } });
    } else {
      // toast.success(`user store , ${user.email}`);
      // toast.success(`user cookie , ${cookies.user.email}`);
    }
  }, [user, cookies]);

  const onSubmit = () => {
    setOpen(false);
    setShareEventOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Segment>
        <Container>
          {ownerEvents && (
            <>
              <h2 style={{ textAlign: 'center' }}>Upcoming Events</h2>
              <Grid columns={3}>
                {Object.values(ownerEvents)?.map((event: NewEvent, index) => (
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
                      <Link to={`/uploadFile/${event.id}`}>Upload images</Link>
                      <Button>Details</Button>
                    </Grid.Column>
                  </Grid.Row>
                ))}
              </Grid>
            </>
          )}

          <ParticipantsEvents />
        </Container>
      </Segment>
      <Button
        className="ui green button"
        icon="add"
        size="huge"
        circular
        style={{ position: 'fixed', bottom: '0', right: '0' }}
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => setOpen(true)}>
        <CreateEvent
          onCancel={onCancel}
          setLink={setLink}
          onSubmit={onSubmit}
        />
      </Modal>
      <Modal open={shareEventOpen} onClose={() => setShareEventOpen(false)}>
        <ShareEvent link={link} />
      </Modal>
    </div>
  );
};

export const eventSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  storage: Yup.number()
    .required('Storage is required')
    .positive('Storage must be a positive number'),
  email: Yup.string().email(),
});

export default Events;
