import { getRekognitionService } from "../../services/init-aws";
import { getObjectFromS3 } from "../../services/s3-service";
import { convertImageToBuffer } from "../utils";

export const getImage = async (eventId: string, faceId: string) => {
  const path = `events/${eventId}/images/faceId/${faceId}`;
  const image = await getObjectFromS3(path);

  return image;
};

export const getImagesByFace = async (username: string, collection: string, userImage: string) => {
  try {
    console.log(`Searching for similar images for user: ${username}`);
    const params = await convertImageToBuffer(collection, userImage);
    const searchFacesResponse = await getRekognitionService()
      .searchFacesByImage(params).promise();

    if(!searchFacesResponse?.FaceMatches?.length) {
      console.log(`No similar images found for user: ${username}`);
      return [];
    }

    console.log(`received faces for user ${username}, response: ${JSON.stringify(searchFacesResponse)}`);

    let images: string[] = [];
    for (const face of searchFacesResponse.FaceMatches) {
      if(face.Face.Confidence > 90){
        const image = await getImage(collection, face.Face.FaceId);
        images.push(image);
      }
    }

    return images;
  } catch (error) {
    console.error(`Error while searching for similar images for user: ${username}, with error: ${error}`);
  }
}
