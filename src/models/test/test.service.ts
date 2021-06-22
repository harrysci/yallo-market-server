import { Injectable } from '@nestjs/common';
import { AuthOwnerService } from '../auth-owner/auth-owner.service';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class TestService {
  private s3: any;

  constructor() {
    this.s3 = new AWS.S3();

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.s3;
    const params = {
      Bucket: bucket,
      Key: 'test/' + String(name),
      Body: file,
    };

    console.log(params);
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        console.log('[S3 Image Upload SUCCESS]');
        resolve(data);
      });
    });
  }

  async upload(file) {
    const { originalname } = file;
    const bucketS3 = process.env.AWS_S3_BUCKET_NAME;
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }
}
