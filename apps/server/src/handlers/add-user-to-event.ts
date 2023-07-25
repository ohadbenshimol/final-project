import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { AddUserToEvent } from "../app/types";
import { subscribeUserToEvent } from "../app/subscribe-user-to-event/add-new-user-to-event";
import { initAws } from "../services/init-aws";

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await initAws();

  try {
    console.log(`Run add-user-to-event-handler - ${JSON.stringify(event.body)}`);
    const body: AddUserToEvent  = JSON.parse(event.body);
    const res = await subscribeUserToEvent(body);
    console.log(`End add-user-to-event-handler`, event);

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
    console.log(`Failed to run add-user-to-event-handler - ${error}`, JSON.stringify(event));
    throw error;
  }
};
