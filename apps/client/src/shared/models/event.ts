export type NewEvent = {
  creationDate: string;
  id: string;
  owner: string;
  name: string;
  storage: string;
  subscribers: Record<string, boolean>
  url?: string;
  description: string;
  imageUrl?: string
};
