import { listAllEventUsers, sendAllImagesToUser } from "./manage-user-data";

export const CloseEvent = async (eventId: string)=> {
  try {
    console.log(`start closing event: ${eventId}`);
    const usersList = await listAllEventUsers(eventId);

    for (const user of usersList) {
      await sendAllImagesToUser(user.Key);
    }
    console.log(`finish to close event ${eventId}, all the images were sent to users`);
  } catch (error) {
    console.error(`Error while closing event: ${eventId}, with error: ${error}`);
  }
}
