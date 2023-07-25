import AWS, { Rekognition, S3 } from "aws-sdk";
import { AWS_REGION } from "../app/types";

let s3: S3;
let rekognition: Rekognition ;

export const initAws = async () => {
  AWS.config.update({region: AWS_REGION, credentials: {accessKeyId: 'AKIAY2YE4MY2SXERX35Q', secretAccessKey: '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'}});
  s3 = new AWS.S3({ region: AWS_REGION });
  rekognition = new AWS.Rekognition({ region: AWS_REGION });
};

export const getS3 = () => s3;
export const getRekognitionService = () => rekognition;
