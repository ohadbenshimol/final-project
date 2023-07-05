import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { GetImagesBody } from '../app/tryps';

export const getPhotoAfterProcess = async () => {
    return 'moshe test';
};

export const getImagesByFace = async (body: GetImagesBody) => {
    // Connect to the Rekognition service
    const rekognition = new AWS.Rekognition();

    // Set the name of the collection you want to search
    const collectionName = body.eventId;

    // Set the path to the image you want to search for
    const imagePath = 'path/to/image.jpg';

    // Read the image file
    const image = fs.readFileSync(imagePath);

    // Create an object containing the image bytes and the collection name
    const params = {
        CollectionId: collectionName,
        Image: {
            Bytes: image,
        },
        MaxFaces: 5,
        FaceMatchThreshold: 85,
    };

    // Search the collection for similar faces
    rekognition.searchFacesByImage(params, (err, data) => {
        if (err) {
            console.log(`An error occurred while trying to search the collection: ${err}`);
        } else {
            if ('FaceMatches' in data) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.FaceMatches.forEach((match) => {
                    console.log(`Similarity: ${match.Similarity}`);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    console.log(`FaceId: ${match.Face.FaceId}`);
                });
            } else {
                console.log('No matches found');
            }
        }
    });
};
