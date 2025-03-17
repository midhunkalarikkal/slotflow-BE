import { S3Client } from '@aws-sdk/client-s3';
import { aws_s3Config } from './env';

let s3Client: S3Client;

if (aws_s3Config.region && aws_s3Config.accessKeyId && aws_s3Config.secretAccessKey) {
  s3Client = new S3Client({
    region: aws_s3Config.region,
    credentials: {
      accessKeyId: aws_s3Config.accessKeyId,
      secretAccessKey: aws_s3Config.secretAccessKey,
    },
  });
} else {
    throw new Error("AWS configuration is missing required parameters.");
}

export { s3Client };