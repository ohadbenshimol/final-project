import axios from "axios";
import { toast } from "react-toastify";

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


export const AddImagesToEvent = async (addImagesBody:AddImagesBody) => {
    try {
        const res = await axios.post(ADD_IMAGES_URL, addImagesBody);
        toast.success('add images to event successfully');
        console.log('res', res);
      } catch (error:any) {
        toast.error(`error ${error?.toString()}`);
        console.log('error', error);
      }
};

export const closeEvent = async (eventIdBody:CloseEventBody) => {
    try {
        const res = await axios.post(CLOSE_EVENT_URL, eventIdBody);
        toast.success('close event successfully');
        console.log('res', res);
      } catch (error:any) {
        toast.error(`error ${error?.toString()}`);
        console.log('error', error);
      }
};

export const addUserToEvent = async (body:AddUserToEvent) => {
  try {
    const res = await axios.post(ADD_USER_URL, body);
    toast.success('add user to event successfully');
    console.log('res', res);
  } catch (error:any) {
    console.log('error', error);
    throw error
  };
}
export const createEvent = async (body:CreateEventBody) => {
  try {
    const res = await axios.post(CREATE_EVENT_URL, body);
    toast.success('create event successfully');
    console.log('res', res);
  } catch (error:any) {
    toast.error(`error ${error?.toString()}`);
    console.log('error', error);
  }
};


// axios interceptor

// export interface InterceptorOptions {
//     service: string;
//     region: string;
//   }
  
//   export interface ICredentials {
//     accessKeyId: string;
//     secretAccessKey: string;
//     sessionToken?: string;
//   }

// const aws4Interceptor =
//   (options: InterceptorOptions, credentials: ICredentials) => (cfg: any) => {
//     const request = {
//       method: cfg.method.toUpperCase(),
//       url: cfg.url,
//       data: cfg.data,
//     };

//     const accessInfo = {
//       access_key: accessKeyId,
//       secret_key: secretAccessKey,
//     };

//     const serviceInfo = {
//       service,
//       region,
//     };

//     const signedRequest = Signer.sign(request, accessInfo, serviceInfo);
//     delete signedRequest.headers['host'];

//     cfg.headers = { ...cfg.headers, ...signedRequest.headers };

//     return cfg;
//   };

// const interceptor = aws4Interceptor(
//   {
//     region,
//     service,
//   },
//   {
//     accessKeyId,
//     secretAccessKey,
//   }
// );

// axios.interceptors.request.use(interceptor);

//example hoe to use it 
//https://stackoverflow.com/questions/60554364/authenticate-to-aws-with-axios-and-aws4