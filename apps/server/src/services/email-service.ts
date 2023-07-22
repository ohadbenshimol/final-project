import { Attachment, SENDER_EMAIL_ADDRESS } from "../app/types";

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'finalproject072@gmail.com',
    pass: 'xyiumgghlwfqcbos'
  }
});

export const sendEmailWithAttachment = async (email: string, username: string, zipBuffer: Buffer) => {
  const attachment: Attachment = {
    filename: `${username}'s-images.zip`,
    contentType: 'application/zip',
    content: zipBuffer,
  };

  const content = {
    from: SENDER_EMAIL_ADDRESS,
    to: email,
    subject: 'Images from event',
    text: `Hey ${username}, \nPlease find the attached zip file.`,
    attachments: [attachment]
  };

  console.log(`sending email to ${email}`);
  transporter.sendMail(content, function(error: any, info: { response: string; }){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
