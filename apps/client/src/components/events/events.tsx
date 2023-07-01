import './events.less';
import {db, eventRef} from "../../helpers/init-firebase";
import {useEffect, useRef, useState} from "react";
import {onValue, push, ref} from "firebase/database";
import {Button, Container, Form, Grid, Modal, Segment} from "semantic-ui-react";
import * as Yup from 'yup';
import {useSelector} from 'react-redux';
import {getUser} from '../../store/reducers/userSlice';
import {useNavigate} from 'react-router-dom';
import {Event} from "../../shared/models/event";

export const eventSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  storage: Yup.number()
    .required('Storage is required')
    .positive('Storage must be a positive number'),
  email: Yup.string().email().required('Email is require'),
});

export interface LoginProps {
}

export function Events() {
  const [events, setEvents] = useState([])
  const [open, setOpen] = useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [formData, setFormValues] = useState({name: '', description: '', storage: '', email: '', url: ''});
  const [link, setLink] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const handleCopyClick = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      await navigator.clipboard.writeText(inputRef.current.value)
    }
  };

  useEffect(() => {
    onValue(eventRef, (snapshot) => {

      setEvents(snapshot?.val())
    });
  }, [])

  const handleChange = (e: any) => {
    const {name, value} = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    try {
      await eventSchema.validate(formData, {abortEarly: false});
      const date = new Date(Date.now());
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString()}`;

      const newEventRef = push(ref(db, 'events/'), {...formData, creationDate: formattedDate});
      const newEventId = newEventRef.key
      const url = `https://only-me-2023.web.app/register-event/${newEventId}`
      setLink(url)

      setFormValues({name: '', description: '', storage: '', email: '', url: ''});
      setOpen(false);
    } catch (e: any) {
      console.error(e)
    }
  };

  const handleAddEvent = () => {
    setSecondModalOpen(true);
  }


  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Segment>
        <Container>
          <h2 style={{textAlign: 'center'}}>Upcoming Events</h2>
          <Grid columns={3}>
            {events && Object.values(events)?.map((event: Event, index) => (
              <Grid.Row key={index}>
                <Grid.Column width={4}>
                  <img className="ui tiny image" src="../../assets/69DFE2D3-0914-4DDB-94BC-E425304646E7.jpg"/>
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
            ))}
          </Grid>
        </Container>
      </Segment>
      <Button
        className="ui green button"
        icon="add"
        size="huge"
        circular
        style={{position: 'fixed', bottom: '0', right: '0'}}
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => setOpen(true)}>
        <Modal.Header>Create Event</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label htmlFor="nameID">Name</label>
              <input id="nameID" name="name" onChange={handleChange} type="text" placeholder="Enter the event name"
                     required/>
            </Form.Field>
            <Form.Field>
              <label htmlFor={"emailId"}>Email</label>
              <input id={"emailId"} name="email" onChange={handleChange} type="email" placeholder="Enter your email"/>
            </Form.Field>
            <Form.Field>
              <label htmlFor={'storageId'}>storge</label>
              <input
                id={'storageId'}
                name="storage"
                onChange={handleChange}
                type="tel"
                placeholder="enter the storage that you need..."
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor={"descriptionId"}>description</label>
              <input id={"descriptionId"} name="description" onChange={handleChange} type="text"
                     placeholder="description..."/>
            </Form.Field>
            <div style={{textAlign: "center"}}>
              <Modal.Actions>
                <Button onClick={handleAddEvent} type="submit" primary>
                  Add event
                </Button>
              </Modal.Actions>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
      <Modal open={secondModalOpen} onClose={() => setSecondModalOpen(false)}>
        <Modal.Header>Add New Event</Modal.Header>
        <Modal.Content>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Link</label>
                <input
                  disabled
                  type="text"
                  value={link}
                  readOnly
                  ref={inputRef}
                />
              </Form.Field>
              <Button onClick={handleCopyClick}>Copy Link</Button>
            </Form>
          </Modal.Content>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Events;

