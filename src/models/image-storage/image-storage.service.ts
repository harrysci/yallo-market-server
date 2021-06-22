import { Injectable } from '@nestjs/common';
import { S3ConfigService } from 'src/config/aws/s3/configuration.service';
import * as AWS from 'aws-sdk';
import { String } from 'aws-sdk/clients/apigateway';
import { S3UploadImageRes } from './interfaces/s3UploadImageRes.interface';

@Injectable()
export class ImageStorageService {
  private s3: any;

  constructor(private readonly s3ConfigService: S3ConfigService) {
    this.s3 = new AWS.S3();

    AWS.config.update({
      accessKeyId: this.s3ConfigService.accessKey,
      secretAccessKey: this.s3ConfigService.secretAccessKey,
      region: this.s3ConfigService.region,
    });
  }

  /**
   * @name getS3Bucket
   * @returns aws s3 bucket
   * aws s3 image bucket 을 반환하는 클래스 내부 함수
   */
  private getS3Bucket(): string {
    const s3BucketName = this.s3ConfigService.s3BucketName;
    return s3BucketName;
  }

  /**
   * @name uploadImage
   * @param file Express Multer 의 File 포맷의 이미지 파일
   * @param path s3 bucket 내에 위치할 경로 및 파일 이름
   * @returns 저장된 이미지 파일 url, s3 file path 반환
   */
  async uploadImage(file: Express.Multer.File, path: string) {
    const awsS3 = this.s3;
    const bucket = this.getS3Bucket();
    const params = {
      Bucket: bucket,
      Key: path + file.originalname,
      Body: file.buffer,
    };

    return new Promise<S3UploadImageRes>((resolve, reject) => {
      awsS3.upload(params, (err, data: S3UploadImageRes) => {
        if (err) {
          reject('[S3 Image Upload Fail ...] ' + err.message);
        } else {
          console.log('[S3 Image Upload SUCCESS] ');
          resolve(data);
        }
      });
    });
  }
}
