import './events.less';
import {db, eventRef} from "../../helpers/init-firebase";
import {useEffect, useState} from "react";
import {onValue, set, ref} from "firebase/database";
import {Button, Container, Form, Grid, Modal, Segment} from "semantic-ui-react";
import * as Yup from 'yup';

type Event = {
  creationDate: string;
  owner: string
  name: string
  url?: string;
  numOfUsers?: number;
  description: string
}
const eventSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  storage: Yup.number().required('Storage is required').positive('Storage must be a positive number'),
  email: Yup.string().email().required("Email is require")
});

export interface LoginProps {
}

export function Events() {
  const title = "Events"
  const [events, setEvents] = useState([])
  const [open, setOpen] = useState(false);
  const [formData, setFormValues] = useState({name: '', description: '', storage: '', email: ''});

  useEffect(() => {
    onValue(eventRef, (snapshot) => {
      setEvents(snapshot.val())
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

      set(ref(db, 'events/' + formData.name), {...formData, creationDate: formattedDate})
    } catch (e: any) {
      console.error(e)
    }
    setOpen(false); // close the modal after form submission
  };
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <Segment>
        <Container>
          <h2 style={{textAlign: 'center'}}>Upcoming Events</h2>
          <Grid columns={3}>
            {Object.values(events).map((event: Event, index) => (
              <Grid.Row key={event.name}>
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
        icon="add"
        size="huge"
        circular
        style={{position: 'fixed', bottom: '0', right: '0'}}
        onClick={() => setOpen(true)}
      />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Create Event</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label htmlFor={"nameID"}>Name</label>
              <input id={"nameID"} name="name" onChange={handleChange} type="text" placeholder="Enter your name"/>
            </Form.Field>
            <Form.Field>
              <label htmlFor={"emailId"}>Email</label>
              <input id={"emailId"} name="email" onChange={handleChange} type="email" placeholder="Enter your email"/>
            </Form.Field>
            <Form.Field>
              <label htmlFor={"storageId"}>storge</label>
              <input id={"storageId"} name="storage" onChange={handleChange} type="tel"
                     placeholder="enter the storage that you need..."/>
            </Form.Field>
            <Form.Field>
              <label htmlFor={"descriptionId"}>description</label>
              <input id={"descriptionId"} name="description" onChange={handleChange} type="text"
                     placeholder="description..."/>
            </Form.Field>
            <div style={{textAlign: "center"}}>
              <Button type="submit" primary>
                Add event
              </Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
};


export default Events;

