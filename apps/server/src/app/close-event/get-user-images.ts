import { getRekognitionService } from "../../services/init-aws";
import { getObjectFromS3, listItemsFromS3Path } from "../../services/s3-service";
import { convertImageToBuffer } from "../utils";

export const getAllUserImages = async (eventId: string, faceId: string) => {
  const path = `events/${eventId}/images/faceId/${faceId}/`;
  const userImages = await listItemsFromS3Path(path);
  const imageArray: string[] = [];

  for (const image of userImages) {
    imageArray.push(await getObjectFromS3(image.Key));
  }

  return imageArray;
};

export const getImagesByFace = async (username: string, collection: string, userImage: string) => {
  try {
    console.log(`Searching for similar images for user: ${username}`);
    const params = convertImageToBuffer(collection, userImage);
    const searchFacesResponse = await getRekognitionService()
      .searchFacesByImage(params).promise();

    if(!searchFacesResponse.FaceMatches.length) {
      console.log(`No similar images found for user: ${username}`);
      return [];
    }

    console.log(`received faces for user ${username}, response: ${JSON.stringify(searchFacesResponse)}`);

    let images;
    for (const face of searchFacesResponse.FaceMatches) {
      if(face.Face.Confidence > 99){
        images = await getAllUserImages(collection, face.Face.FaceId);
      }
    }

    return images;
  } catch (error) {
    console.error(`Error while searching for similar images for user: ${username}, with error: ${error}`);
  }
}
