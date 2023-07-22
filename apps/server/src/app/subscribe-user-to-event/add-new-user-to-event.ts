import { AddUserToEvent } from "../types";
import { uploadObjectToS3 } from "../../services/s3-service";

export const subscribeUserToEvent = async (body: AddUserToEvent) => {
  console.log(`start upload to s3 user ${body.username} data`);

  const objectKey = `events/${body.eventId}/users/${body.username}`;
  const objectBody = JSON.stringify({
    userImage: body.image,
    collection: body.eventId,
    email: body.email,
    username: body.username
  })

  console.log(`moshe ${objectKey} \n and body ${objectBody}`);

  await uploadObjectToS3(objectKey, objectBody)
  console.log(`Event with ID ${body.eventId} saved to S3 successfully for user: ${body.username}.`);
}
