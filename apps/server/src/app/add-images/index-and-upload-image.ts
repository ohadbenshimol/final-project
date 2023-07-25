import { AddImagesBody } from '../types';
import { getRekognitionService } from "../../services/init-aws";
import { uploadObjectToS3 } from "../../services/s3-service";
import { convertImageToBuffer } from "../utils";

export const IndexAndUploadImage = async (body: AddImagesBody) => {
  const collectionName = body.eventId;

  for (const encodedImage of body.images) {
    const params = await convertImageToBuffer(collectionName, encodedImage);

    try {
      const data = await getRekognitionService().indexFaces(params).promise();
      console.log(`Image was successfully indexed and saved to collection: ${collectionName}, with response: ${JSON.stringify(data)}`);

      for (const faceRecord of data.FaceRecords) {
        await uploadIndexedImage(collectionName, encodedImage, faceRecord.Face.FaceId)
      }
      console.log(`Image was successfully indexed and saved to collection: ${JSON.stringify(data)}`);
    } catch (err) {
      console.log(`An error occurred while trying to index the image: ${err}`);
    }
  }
};

export const uploadIndexedImage = async (eventId: string, image: string, faceId: string) => {
  console.log(`start upload to s3 indexed image with params`, {eventId, faceId});

  const objectKey = `events/${eventId}/images/faceId/${faceId}`;
  await uploadObjectToS3(objectKey, image);

  console.log(`image with faceId ${faceId} saved to S3 successfully under event: ${eventId}.`);
}
