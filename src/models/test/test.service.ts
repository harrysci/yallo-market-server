import { Injectable } from '@nestjs/common';
import { AuthOwnerService } from '../auth-owner/auth-owner.service';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { S3ConfigService } from 'src/config/aws/s3/configuration.service';

@Injectable()
export class TestService {
  private s3: any;

  constructor(private readonly awsS3ConfigService: S3ConfigService) {
    this.s3 = new AWS.S3();

    AWS.config.update({
      accessKeyId: this.awsS3ConfigService.accessKey,
      secretAccessKey: this.awsS3ConfigService.secretAccessKey,
      region: this.awsS3ConfigService.region,
    });
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.s3;
    const params = {
      Bucket: bucket,
      Key: 'test/' + String(name),
      Body: file,
    };

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
    const bucketS3 = this.awsS3ConfigService.s3BucketName;
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }
}
