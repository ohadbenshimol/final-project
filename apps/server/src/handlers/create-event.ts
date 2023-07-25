import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CreateEventBody } from "../app/types";
import { CreateEvent } from "../app/create-event/create-event-and-images-collection";
import { initAws } from "../services/init-aws";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await initAws();

  try {
    console.log(`Run create-event-handler - ${JSON.stringify(event.body)}`);
    const body: CreateEventBody = JSON.parse(event.body);
    const res = await CreateEvent(body.eventId);
    console.log(`End create-event-handler`, event);

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
    console.log(`Failed to run create-event-handler - ${error}`, JSON.stringify(event.body));
    throw error;
  }
};
