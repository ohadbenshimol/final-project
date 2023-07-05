import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { IndexAndUploadImage } from '../api/index-and-upload-image';
import { AddImagesBody } from '../app/tryps';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        console.log(`Run add-images-handler - ${JSON.stringify(event.body)}`);
        const body: AddImagesBody = JSON.parse(event.body);
        const res = await IndexAndUploadImage(body);
        console.log(`End add-images-handler`, event);

        return {
            statusCode: 200,
            body: JSON.stringify(res),
        };
    } catch (error) {
        console.log(`Failed to run add-images-handler - ${error}`, JSON.stringify(event.body));
        throw error;
    }
};
