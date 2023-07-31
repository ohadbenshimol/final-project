import { Attachment, SENDER_EMAIL_ADDRESS } from "../app/types";
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'finalproject072@gmail.com',
    pass: 'skwhomxmcdyhniqu'
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
    html: `
    <div>
      <p>Hey ${username},</p>
      <p>Please find your images in the attached zip file.</p>
      <p>Thanks for using our app!</p>
      <p>Only Me Team.</p>
      <img src="https://i.ibb.co/4VV6mJp/b5b2ca62ac3abf47.jpg" style="width: 150px; height: 150px;" />
    </div>
    `,
    attachments: [attachment]
  };

  console.log(`sending email to ${email}`);
  try {
    const info = await transporter.sendMail(content);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(`Error while sending email to ${email}, with error: ${error}`);
  }
}
