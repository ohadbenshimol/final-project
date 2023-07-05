import * as AWS from 'aws-sdk';
import fs from 'fs';
import { AddImagesBody } from '../app/tryps';

export const IndexAndUploadImage = async (body: AddImagesBody) => {
    // Connect to the Rekognition service
    const rekognition = new AWS.Rekognition();

    // Set the name of the collection you want to save the image to
    const collectionName = body.eventId;

    // Set the path to the image you want to send for facial recognition
    const imagePath = 'path/to/image.jpg';

    // Read the image file
    const image = fs.readFileSync(imagePath);

    // Create an object containing the image bytes and the collection name
    const params = {
        CollectionId: collectionName,
        Image: {
            Bytes: image,
        },
    };

    // Send the image to Rekognition for facial recognition
    rekognition.indexFaces(params, (err, data) => {
        if (err) {
            console.log(`An error occurred while trying to index the image: ${err}`);
        } else {
            console.log(`Image was successfully indexed and saved to collection: ${collectionName}`);
        }
    });
};
