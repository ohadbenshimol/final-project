import { getS3 } from "./init-aws";
import { EVENT_BUCKET_NAME } from "../app/types";

export const listItemsFromS3Path = async (path: string) => {
  try {
    const listObjectsResponse = await getS3().listObjectsV2({
      Bucket: EVENT_BUCKET_NAME,
      Prefix: path,
    }).promise();
    console.log(`receiving objects list for prefix: ${path}, list size: ${JSON.stringify(listObjectsResponse.Contents.length)}`);

    return listObjectsResponse.Contents || [];
  } catch (e){
    console.log(`failed to list items from path ${path} with error: ${e}`);
    throw e;
  }
}

export const getObjectFromS3 = async (objectKey: string): Promise<string> => {
  try {
    const getObjectResponse = await getS3().getObject({ Bucket: EVENT_BUCKET_NAME, Key: objectKey }).promise();
    console.log(`receiving object for key: ${objectKey}, object: ${JSON.stringify(getObjectResponse.Body)}`);

    return getObjectResponse.Body?.toString();
  } catch (e){
    console.log(`failed get object from ${objectKey} with error: ${e}`);
    throw e;
  }
}

export const uploadObjectToS3 = async (objectKey: string, body: string): Promise<void> => {
  try {
    await getS3().upload({
      Bucket: EVENT_BUCKET_NAME,
      Key: objectKey,
      Body: body,
    }).promise();
  } catch (e) {
    console.log(`failed to upload object with key ${objectKey} with error:`, e);
    throw e;
  }
}



