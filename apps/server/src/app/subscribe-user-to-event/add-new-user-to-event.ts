import { AddUserToEvent } from "../types";
import { uploadObjectToS3 } from "../../services/s3-service";

export const subscribeUserToEvent = async (body: AddUserToEvent) => {
  console.log(`start upload to s3 user ${body.username} data`);

  const objectKey = `events/${body.eventId}/users/${body.username}`;
  const objectBody = JSON.stringify({
    userImage: body.image,
    collection: body.eventId,
    email: body.email,
    username: body.username
  })

  console.log(`moshe ${objectKey} \n and body ${objectBody}`);

  await uploadObjectToS3(objectKey, objectBody)
  console.log(`Event with ID ${body.eventId} saved to S3 successfully for user: ${body.username}.`);
}


// export const verifyEmailAddress = async (email: string) => {
//   try {
//     const emailToVerify = "moshiko3399@gmail.com";
//     // const verificationLink = 'https://example.com/verify';
//     const params1: SES.GetIdentityVerificationAttributesRequest = {
//       Identities: [emailToVerify],
//     }
//     const result1 = await getSes().getIdentityVerificationAttributes(params1).promise();
//     const verificationAttributes = result1.VerificationAttributes;
//
//     const verificationToken = verificationAttributes[emailToVerify].VerificationToken;
//     const verificationLink = `https://emailverification.awsregion.amazonaws.com/?Identity=${encodeURIComponent(emailToVerify)}&VerificationToken=${encodeURIComponent(verificationToken)}`;
//
//
//     const params: SES.SendRawEmailRequest = {
//       RawMessage: {
//         Data: createVerificationEmail(SENDER_EMAIL_ADDRESS, emailToVerify, verificationLink),
//       },
//     };
//
//     const result = await getSes().sendRawEmail(params).promise();
//     console.log(`Verification email sent to ${email}. Message ID: ${result.MessageId}`);
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error;
//   }
// };
//
// const createVerificationEmail = (from: string, to: string, verificationLink: string): string => {
//   const boundary = `boundary_${Date.now()}`;
//
//   const headers = [
//     `From: ${from}`,
//     `To: ${to}`,
//     'Subject: Email Address Verification',
//     'MIME-Version: 1.0',
//     `Content-Type: multipart/alternative; boundary="${boundary}"`,
//   ];
//
//   const emailContent = [
//     `--${boundary}`,
//     'Content-Type: text/plain; charset="UTF-8"',
//     '',
//     'Please verify your email address by clicking the following link:',
//     '',
//     verificationLink,
//     '',
//     `--${boundary}`,
//     'Content-Type: text/html; charset="UTF-8"',
//     '',
//     '<html><body>',
//     '<h1>Email Address Verification</h1>',
//     '<p>Please verify your email address by clicking the following link:</p>',
//     `<a href="${verificationLink}">${verificationLink}</a>`,
//     '</body></html>',
//     `--${boundary}--`,
//   ];
//
//   return headers.join('\r\n') + '\r\n\r\n' + emailContent.join('\r\n');
// };
