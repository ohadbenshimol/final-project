const sharp = require('sharp');

export const convertImageToBuffer = async (collection: string, image: string) => {
  console.log(`convert image to buffer with collection: ${collection} and image: ${image}`);

  const isWebp = image.includes('webp');
  const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const imageBuffer = isWebp ? await convertWebpToJpegBase64(base64Data) : Buffer.from(base64Data, 'base64');

  const params = {
    CollectionId: collection,
    Image: {
      Bytes: imageBuffer,
    },
  };

  return params;
}

const convertWebpToJpegBase64 = async (webpBase64: string) => {
  const webpBuffer = Buffer.from(webpBase64, 'base64');
  const jpgPromise = sharp(webpBuffer).jpeg();
  return await jpgPromise.toBuffer();
};

//
//
// (async () => {
//   const collectionName = 'test';
//   const params = convertImageToBuffer(collectionName, imageToBase64);
// })();
