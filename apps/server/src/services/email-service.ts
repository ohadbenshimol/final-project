import AWS from 'aws-sdk';
import { AWS_REGION, SENDER_EMAIL_ADDRESS } from '../app/types';

const ses = new AWS.SES({ region: AWS_REGION });

export const sendEmailWithAttachment = async (email: string, username: string, zipBuffer: Buffer) => {
  const params = {
    Source: SENDER_EMAIL_ADDRESS,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: 'Matched Images',
      },
      Body: {
        Text: {
          Data: 'Please find the attached zip file containing matched images.',
        },
      },
    },
    Attachments: [
      {
        Filename: `${username}-images.zip`,
        Content: zipBuffer,
      },
    ],
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(`Sent email with matched images to ${email}. Message ID: ${result.MessageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw error;
  }
};
