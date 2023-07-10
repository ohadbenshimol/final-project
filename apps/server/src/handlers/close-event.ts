import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CloseEventBody } from "../app/types";
import { CloseEvent } from "../api/close-event-and-send-images";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Run close-event-handler - ${JSON.stringify(event.body)}`);
    const body: CloseEventBody = JSON.parse(event.body);
    const res = CloseEvent(body.eventId);
    console.log(`End close-event-handler`, event);

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.log(`Failed to run close-event-handler - ${error}`, JSON.stringify(event.body));
    throw error;
  }
};
