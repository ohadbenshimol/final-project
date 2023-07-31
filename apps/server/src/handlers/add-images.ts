import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { IndexAndUploadImage } from '../app/add-images/index-and-upload-image';
import { AddImagesBody } from '../app/types';
import { initAws } from "../services/init-aws";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await initAws();

    try {
        const body: AddImagesBody = JSON.parse(event.body);
        console.log(`Run add-images-handler to event - ${body.eventId}`);
        console.log(`start to indexing ${body.images?.length} images from user ${body.username}`);
        const res = await IndexAndUploadImage(body);
        console.log(`End add-images-handler to event - ${body.eventId}`);

        return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*", // Allow from anywhere
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET" // Allow these HTTP methods
            },
            body: JSON.stringify(res),
        };
    } catch (error) {
        console.log(`Failed to run add-images-handler to event ${JSON.parse(event.body).eventId} with error - ${error}`);
        throw error;
    }
};
