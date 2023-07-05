import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getImagesByFace } from '../api/get-images-by-face';
import { GetImagesBody } from '../app/tryps';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        console.log(`Run get-images-handler - ${JSON.stringify(event.body)}`);
        const body: GetImagesBody = JSON.parse(event.body);

        const images = await getImagesByFace(body);
        console.log(`End get-images-handler`, event);

        return {
            statusCode: 200,
            body: JSON.stringify(images),
        };
    } catch (error) {
        console.log(`Failed to run get-images-handler - ${error}`, JSON.stringify(event.body));
        throw error;
    }
};
