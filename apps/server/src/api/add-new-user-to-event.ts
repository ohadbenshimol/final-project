import AWS from 'aws-sdk';
import {AddUserToEvent, EVENT_BUCKET_NAME} from "../app/types";

// Configure AWS SDK with your credentials and region
AWS.config.update({ region: 'eu-central-1' });

// Create an S3 client
const s3 = new AWS.S3();

export const saveEventToS3 = async (body: AddUserToEvent) => {

  const { username, email, eventId, image} = body;

  // Decode the base64 image data
  const imageBuffer = Buffer.from(image, 'base64');

  try {
    // Upload the image to S3 bucket
    await s3
      .upload({
        Bucket: EVENT_BUCKET_NAME,
        Key: `events/${eventId}/${username}`,
        Body: JSON.stringify({
          userImage: imageBuffer,
          collection: eventId,
          email,
          username
        }),
      })
      .promise();

    console.log(`Event with ID ${eventId} saved to S3 successfully.`);
  } catch (error) {
    console.error(`Error saving event to S3: ${error}`);
  }
}
