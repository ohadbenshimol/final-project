import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { AddUserToEvent } from "../app/types";
import { saveEventToS3 } from "../api/add-new-user-to-event";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Run add-user-to-event-handler - ${JSON.stringify(event)}`);
    const body: AddUserToEvent  = JSON.parse(JSON.stringify(event));
    const res = await saveEventToS3(body);
    console.log(`End add-user-to-event-handler`, event);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.log(`Failed to run add-user-to-event-handler - ${error}`, JSON.stringify(event));
    throw error;
  }
};
