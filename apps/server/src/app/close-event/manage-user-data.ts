import { getObjectFromS3, listItemsFromS3Path } from "../../services/s3-service";
import { getImagesByFace } from "./get-user-images";
import { createZipFile } from "../../services/create-zip-file";
import { sendEmailWithAttachment } from "../../services/email-service";

export const listAllEventUsers = async (eventId: string) => {
  console.log(`start to pull all users list from event: ${eventId}`);
  const path = `events/${eventId}/users/`;

  const usersList = await listItemsFromS3Path(path);
  console.log(`receiving users list from event: ${eventId}, users: ${JSON.stringify(usersList)}`);

  return usersList;
}

export const buildAndSendImages = async (images: string[], username: string, email: string) => {
  if (images?.length > 0) {
    const zipBuffer = await createZipFile(username, images);
    await sendEmailWithAttachment(email, username, zipBuffer);
  } else {
    console.log(`there is no images found for user: ${username}`);
  }
};

export const sendAllImagesToUser = async (key: string) => {
  console.log(`start preparing images for object: ${key}`);
  const userObject = await getObjectFromS3(key);

  if (userObject) {
    const { username, email, collection, userImage } = JSON.parse(userObject);
    const images = await getImagesByFace(username, collection, userImage);
    await buildAndSendImages(images, username, email);
  } else {
  	console.log(`object not found for objectKey: ${key}`);
  }
}



