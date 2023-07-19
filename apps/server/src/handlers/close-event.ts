import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CloseEventBody } from "../app/types";
import { CloseEvent } from "../app/close-event/close-event-and-send-images";
import { initAws } from "../services/init-aws";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await initAws();

  try {
    console.log(`Run close-event-handler - ${JSON.stringify(event.body)}`);
    const body: CloseEventBody = JSON.parse(event.body);
    const res = await CloseEvent(body.eventId);
    console.log(`End close-event-handler`, event);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET" // Allow these HTTP methods
      },
      body: JSON.stringify(res),
    };
  } catch (error) {
    console.log(`Failed to run close-event-handler - ${error}`, JSON.stringify(event.body));
    throw error;
  }
};
