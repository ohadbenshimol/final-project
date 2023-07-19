export const convertImageToBuffer = (collection: string, image: string) => {
  const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const imageBlob = Uint8Array.from(Buffer.from(base64Data, 'base64'));

  const params = {
    CollectionId: collection,
    Image: {
      Bytes: imageBlob,
    },
  };

  return params;
}
