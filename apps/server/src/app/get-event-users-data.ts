import AWS from "aws-sdk";
import { AWS_REGION } from "./types";

// Configure AWS SDK with your credentials and region
AWS.config.update({ region: AWS_REGION });
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

export const listAllEventUsers = async (bucketName: string, eventId: string) => {
  try {
    console.log(`start to pull all users list from event: ${eventId}`);

    // List users objects in the S3 bucket
    const listObjectsResponse = await s3.listObjectsV2({ Bucket: bucketName, Prefix: `events/${eventId}/` }).promise();
    const usersList = listObjectsResponse.Contents || [];

    return usersList;

  } catch (error) {
    console.error(`Error receiving the users list from event: ${eventId}, with error: ${error}`);
  }
}

export const getUserDataFromS3 = async (bucketName: string, userObjectKey: string) => {
  try {
    console.log(`start to pull all user data object with key: ${userObjectKey}`);

    // Get user object data from S3
    const getObjectResponse = await s3.getObject({ Bucket: bucketName, Key: userObjectKey }).promise();
    return getObjectResponse.Body?.toString();

  } catch (error) {
    console.error(`Error getting user object with user key: ${userObjectKey}, with error: ${error}`);
  }
}

export const getImagesByFace = async (username: string, collection: string, userImage: string) => {
  try {
    console.log(`Searching for similar images for user: ${username}`);

    // Search for similar images using Amazon Rekognition
    const searchFacesResponse = await rekognition
      .searchFacesByImage({
        CollectionId: collection,
        Image: {
          Bytes: Buffer.from(userImage, 'base64'),
        },
      })
      .promise();

    return searchFacesResponse.FaceMatches || [];

  } catch (error) {
    console.error(`Error while searching for similar images for user:${username}, with error: ${error}`);
  }
}

