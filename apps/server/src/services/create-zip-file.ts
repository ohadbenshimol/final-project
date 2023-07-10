import archiver from 'archiver';

export const createZipFile = async (username: string, faces: AWS.Rekognition.FaceMatch[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers: Buffer[] = [];

    archive.on('error', (error: any) => {
      console.error(`Error creating zip file: ${error}`);
      reject(error);
    });

    archive.on('data', (data: Buffer) => {
      buffers.push(data);
    });

    archive.on('end', () => {
      const zipBuffer = Buffer.concat(buffers);
      console.log(`Created zip file for event ${username}`);
      resolve(zipBuffer);
    });

    for (const [index, face] of faces.entries()) {
      const matchedImage = face.Face?.ExternalImageId || index;
      const buffer = Buffer.from(matchedImage as string, 'base64'); // Decode base64 image data
      archive.append(buffer, { name: `matched-image-${matchedImage}.jpg` });
    }

    archive.finalize();
  });
}
