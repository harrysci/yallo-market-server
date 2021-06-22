import { Injectable } from '@nestjs/common';
import { S3ConfigService } from 'src/config/aws/s3/configuration.service';
import * as AWS from 'aws-sdk';
import { S3UploadImageRes } from './interfaces/s3UploadImageRes.interface';
import { S3DownloadImageRes } from './interfaces/s3DownloadImageRes.interface';
import { S3GetImageUrlRes } from './interfaces/s3GetImageUrlRes.interface';

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
   * @name uploadImage
   * @param file Express Multer 의 File 포맷의 이미지 파일
   * @param path s3 bucket 내에 위치할 경로 및 파일 이름
   * @returns 저장된 이미지 파일 url 링크, s3 file path 반환
   */
  async uploadImage(
    file: Express.Multer.File,
    path: string,
  ): Promise<S3UploadImageRes> {
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

  /**
   * @name downloadImage
   * @param path s3 bucket 내의 경로 및 파일 이름
   * @returns 저장된 이미지 파일 blob 객체
   */
  async downloadImage(path: string): Promise<S3DownloadImageRes> {
    const awsS3 = this.s3;
    const bucket = this.getS3Bucket();
    const params = {
      Bucket: bucket,
      Key: path,
    };

    return new Promise<S3DownloadImageRes>((resolve, reject) => {
      return awsS3.getObject(params, (err, data: S3DownloadImageRes) => {
        if (err) {
          reject('[S3 Image Download Fail ...] ' + err.message);
        } else {
          console.log('[S3 Image Download SUCCESS] ');
          resolve(data);
        }
      });
    });
  }

  /**
   * @name getImageUrl
   * @param path s3 bucket 내의 경로 및 파일 이름
   * @returns 저장된 이미지 파일 접속 url 링크
   */
  async getImageUrl(path: string): Promise<S3GetImageUrlRes> {
    const awsS3 = this.s3;
    const bucket = this.getS3Bucket();
    const params = {
      Bucket: bucket,
      Key: path,
    };

    return new Promise<S3GetImageUrlRes>((resolve, reject) => {
      awsS3.getSignedUrlPromise('getObject', params, (err, data) => {
        if (err) {
          reject('[Get S3 Image Url Fail ...] ' + err.message);
        } else {
          console.log('[Get S3 Image Url SUCCESS] ');
          resolve({
            url: data,
          });
        }
      });
    });
  }

  /**
   * @name deleteImage
   * @param path s3 bucket 내의 경로 및 파일 이름
   * @returns void
   */
  async deleteImage(path: string): Promise<void> {
    const awsS3 = this.s3;
    const bucket = this.getS3Bucket();
    const params = {
      Bucket: bucket,
      Key: path,
    };

    return new Promise<void>((resolve, reject) => {
      awsS3.deleteObject(params, (err, data) => {
        if (err) {
          reject('[S3 Image Delete Fail ...] ' + err.message);
        } else {
          console.log('[S3 Image Delete SUCCESS] ');
          resolve(data);
        }
      });
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
}
