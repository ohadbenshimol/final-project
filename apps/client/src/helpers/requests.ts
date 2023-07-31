import axios from 'axios';
import { setMessage } from './utils';

interface AddImagesBody {
  eventId: string;
  username: string;
  images: string[];
}

interface AddUserToEvent {
  eventId: string;
  username: string;
  email: string;
  image: string;
}

interface CreateEventBody {
  eventId: string;
}

interface CloseEventBody {
  eventId: string;
}

const URL = 'https://ca82so4kc5.execute-api.eu-central-1.amazonaws.com/prod';
const CLOSE_EVENT_URL = `${URL}/close/event`;
const ADD_USER_URL = `${URL}/add/user`;
const CREATE_EVENT_URL = `${URL}/create/event`;
export const ADD_IMAGES_URL = `${URL}/add/images`;

export const AddImagesToEvent = async (addImagesBody: AddImagesBody) => {
  try {
    await axios.post(ADD_IMAGES_URL, addImagesBody);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    console.error('error', error);
  }
};

export const closeEvent = async (eventIdBody: CloseEventBody) => {
  try {
    const res = await axios.post(CLOSE_EVENT_URL, eventIdBody);
    setMessage('The event was closed successfully', 'success');
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    console.error('error', error);
  }
};

export const addUserToEvent = async (body: AddUserToEvent) => {
  try {
    await axios.post(ADD_USER_URL, body);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    throw error;
  }
};

export const createEvent = async (body: CreateEventBody) => {
  try {
    const res = await axios.post(CREATE_EVENT_URL, body);
    setMessage('Create event successfully', 'success');
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    console.error('error', error);
  }
};
