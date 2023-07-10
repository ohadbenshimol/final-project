import { EVENT_BUCKET_NAME } from "../app/types";
import { getImagesByFace, getUserDataFromS3, listAllEventUsers } from "../app/get-event-users-data";
import { createZipFile } from "../services/create-zip-file";
import { sendEmailWithAttachment } from "../services/email-service";

export async function CloseEvent(eventId: string) {
  try {
    console.log(`start closing event: ${eventId}`);

    const usersList = await listAllEventUsers(EVENT_BUCKET_NAME, eventId);

    for (const user of usersList) {
      const key = user.Key;

      if (key) {
        console.log(`Processing object: ${key}`);
        const userObject = await getUserDataFromS3(EVENT_BUCKET_NAME, key);

        if (userObject) {
          const { username, email, collection, userImage } = JSON.parse(userObject);

          const faces = await getImagesByFace(collection, username, userImage);

          if (faces.length > 0) {
            // Create a zip file containing the matched images
            const zipBuffer = await createZipFile(username, faces);

            // Send the zip file as an email attachment
            await sendEmailWithAttachment(email, username, zipBuffer);
          } else {
            console.log(`No similar images found for user: ${username}`);
          }
        }
      }
    }

    console.log(`finish to close event ${eventId}, all the images were sent to users`);
  } catch (error) {
    console.error(`Error while closing event: ${eventId}, with error: ${error}`);
  }
}

