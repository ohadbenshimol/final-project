import axios from "axios";
import {setMessage} from "./utils";

export interface AddImagesBody {
  eventId: string;
  images: string[];
}

export interface AddUserToEvent {
  eventId: string;
  username: string;
  email: string;
  image: string;
}

export interface CreateEventBody {
  eventId: string;
}

export interface CloseEventBody {
  eventId: string;
}

export const URL = 'https://ca82so4kc5.execute-api.eu-central-1.amazonaws.com/prod';//OHAD API
// export const URL = 'https://2ipqts95ri.execute-api.eu-central-1.amazonaws.com/prod';//OHAD API
//export const URL = 'https://d1f475jv9e.execute-api.eu-central-1.amazonaws.com/prod'; //MOSHE API

const CLOSE_EVENT_URL = `${URL}/close/event`;
const ADD_USER_URL = `${URL}/add/user`;
const ADD_IMAGES_URL = `${URL}/add/images`;
const CREATE_EVENT_URL = `${URL}/create/event`;

const accessKeyId = 'AKIAY2YE4MY2SXERX35Q';
const secretAccessKey = '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';

const AmplifyAccesskey = 'AKIAY2YE4MY27YH2GREG';
const SecretAccesskey = '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';

const region = 'eu-central-1';
const service = 'execute-api';


export const AddImagesToEvent = async (addImagesBody: AddImagesBody) => {
  try {
    const res = await axios.post(ADD_IMAGES_URL, addImagesBody);
    console.log('res', res);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error')
    console.log('error', error);
  }
};

export const closeEvent = async (eventIdBody: CloseEventBody) => {
  try {
    const res = await axios.post(CLOSE_EVENT_URL, eventIdBody);
    setMessage('The event was closed successfully', 'success')
    console.log('res', res);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    console.log('error', error);
  }
};

export const addUserToEvent = async (body: AddUserToEvent) => {
  try {
     await axios.post(ADD_USER_URL, body);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error')
    throw error
  }
  ;
}
export const createEvent = async (body: CreateEventBody) => {
  try {
    const res = await axios.post(CREATE_EVENT_URL, body);
    setMessage('Create event successfully', 'success')
    console.log('res', res);
  } catch (error: any) {
    setMessage(`Error ${error?.toString()}`, 'error');
    console.log('error', error);
  }
};
