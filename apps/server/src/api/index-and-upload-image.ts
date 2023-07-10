import * as AWS from 'aws-sdk';
import { AddImagesBody } from '../app/types';

export const IndexAndUploadImage = async (body: AddImagesBody) => {
  // Connect to the Rekognition service
  const rekognition = new AWS.Rekognition();

  // Set the name of the collection you want to save the images to
  const collectionName = body.eventId;

  // Iterate over the array of base64-encoded images
  for (const encodedImage of body.images) {
    // Decode the base64 image data
    const imageBuffer = Buffer.from(encodedImage, 'base64');

    // Create an object containing the image bytes and the collection name
    const params = {
      CollectionId: collectionName,
      Image: {
        Bytes: imageBuffer,
      },
    };

    // Send the image to Rekognition for facial recognition
    try {
      const data = await rekognition.indexFaces(params).promise();
      console.log(`Image was successfully indexed and saved to collection: ${collectionName}`);
      // Handle the result as needed
    } catch (err) {
      console.log(`An error occurred while trying to index the image: ${err}`);
      // Handle the error as needed
    }
  }
};
