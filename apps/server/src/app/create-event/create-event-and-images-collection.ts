import { getRekognitionService } from "../../services/init-aws";

export const CreateEvent = async (eventId: string): Promise<void> => {
  try {
    const response =  await getRekognitionService().createCollection({CollectionId: eventId}).promise();
    console.log(`Collection '${eventId}' created successfully withe response: ${JSON.stringify(response)}.`);
  } catch (error) {
    console.error("Error creating collection.", error);
  }
}
