import { registerAs } from '@nestjs/config';

export default registerAs('aws-s3', () => ({
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  s3BucketName: process.env.AWS_S3_BUCKET_NAME,
}));
