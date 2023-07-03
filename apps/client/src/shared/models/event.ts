export type Event = {
  creationDate: string;
  id: string;
  owner: string;
  name: string;
  storage: string;
  subscribers: { [key: string]: boolean };
  url?: string;
  description: string;
};
