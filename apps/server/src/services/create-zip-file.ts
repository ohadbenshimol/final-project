import archiver from 'archiver';

export const createZipFile = async (username: string, images: string[]): Promise<Buffer> => {
  console.log(`Starting create zip file`);

  return await new Promise<Buffer>((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers: Buffer[] = [];

    archive.on('error', (error: Error) => {
      console.error(`Error creating zip file: ${error}`);
      reject(error);
    });

    archive.on('data', (data: Buffer) => {
      buffers.push(data);
    });

    archive.on('end', () => {
      const zipBuffer = Buffer.concat(buffers);
      console.log(`Created zip file for user ${username}`);
      resolve(zipBuffer);
    });

    for (const [index, image] of images.entries()) {
      try {
        const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        archive.append(buffer, { name: `matched-image-${index}.jpg` });
      } catch (error) {
        console.error(`Error processing image data: ${error}`);
        reject(error);
      }
    }

    archive.finalize();
  });
};
