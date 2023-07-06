import ParticipantsEvents from '../participantsEvents/ParticipantsEvents';
import { FC, useEffect, useState } from 'react';
import { Button, Container, Modal, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { CreateEvent } from '../createEvent/CreateEvent';
import { ShareEvent } from '../shareEvent/ShareEvent';
import { OwnerEvents } from '../ownerEvents/OwnerEvents';
import './events.less';

interface EventsProps {}

export const Events: FC<EventsProps> = () => {
  const user = useSelector(getUser);
  const navigate = useNavigate();

  const [cookies] = useCookies(['user']);
  const [createEventIsOpen, setCreateEventIsOpen] = useState(false);
  const [shareEventOpen, setShareEventOpen] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      navigate('/', { state: { from: '/events' } });
    } else {
      // toast.success(`user store , ${user.email}`);
      // toast.success(`user cookie , ${cookies.user.email}`);
    }
  }, [user, cookies]);

  const onSubmit = () => {
    setCreateEventIsOpen(false);
    setShareEventOpen(true);
  };

  const onCancel = () => {
    setCreateEventIsOpen(false);
  };

  const onClickAddEvent = () => setCreateEventIsOpen(true);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Segment>
        <Container>
          <OwnerEvents />
          <ParticipantsEvents />
        </Container>
      </Segment>
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
    </div>
  );
};

export default Events;
