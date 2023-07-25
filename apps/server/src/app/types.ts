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

export interface CloseEventBody {
  eventId: string;
}
export interface CreateEventBody {
  eventId: string;
}

export interface Attachment {
  filename: string;
  contentType: string;
  content: Buffer;
}

export const EVENT_BUCKET_NAME = 'photo-face-events-bucket';
export const AWS_REGION = 'eu-central-1';
export const SENDER_EMAIL_ADDRESS = 'finalproject072@gmail.com';
