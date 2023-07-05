import { eventsRef } from '../../helpers/firebase';
import * as Yup from 'yup';
import { FC, FormEvent, useState } from 'react';
import { push } from 'firebase/database';
import { Button, Form, Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser } from '../../store/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { CLIENT_URL } from '../../helpers/config';
import './CreateEvent.less';

interface CreateEventProps {
  setLink: (link: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  storage: '',
  url: '',
};

export const CreateEvent: FC<CreateEventProps> = ({
  setLink,
  onSubmit,
  onCancel,
}) => {
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [formData, setFormValues] = useState(DEFAULT_FORM_DATA);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      if (!user.email) {
        navigate('/', { state: { from: '/events' } });
      }
      await eventSchema.validate(formData, { abortEarly: false });
      const date = new Date(Date.now());
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear().toString()}`;

      const newEventRef = push(eventsRef, {
        ...formData,
        creationDate: formattedDate,
        owner: user.id,
        subscribers: {
          [user.id!]: true,
        },
      });

      setLink(`${CLIENT_URL}/register-event/${newEventRef.key}`);
      setFormValues(DEFAULT_FORM_DATA);
      onSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal.Header>Create Event</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label htmlFor="nameID">Name</label>
            <input
              id="nameID"
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="Enter the event name"
              required
            />
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
            <label htmlFor={'descriptionId'}>description</label>
            <input
              id={'descriptionId'}
              name="description"
              onChange={handleChange}
              type="text"
              placeholder="description..."
            />
          </Form.Field>
          <div style={{ textAlign: 'center' }}>
            <Modal.Actions>
              <Button onClick={handleOnCancel} secondary>
                cancel
              </Button>
              <Button type="submit" primary>
                create event now
              </Button>
            </Modal.Actions>
          </div>
        </Form>
      </Modal.Content>
    </>
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
