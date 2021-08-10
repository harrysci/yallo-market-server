import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

/* AWS S3 config provider */
import { S3ConfigService } from 'src/config/aws/s3/configuration.service';

/* type and interfaces */
import { PathCase } from '../store/constants/pathCase.type';
import { S3UploadImageRes } from './interfaces/s3UploadImageRes.interface';
import { S3DownloadImageRes } from './interfaces/s3DownloadImageRes.interface';
import { S3GetImageUrlRes } from './interfaces/s3GetImageUrlRes.interface';

/**
 * @name S3_이미지_CRUD_Provider_Class
 */
@Injectable()
export class ImageStorageService {
  private s3: any;

  constructor(private readonly s3ConfigService: S3ConfigService) {
    this.s3 = new AWS.S3();

    /* AWS Config 를 iam 계정의 certification 으로 업데이트, s3 접근 권한 확보 */
    AWS.config.update({
      accessKeyId: this.s3ConfigService.accessKey,
      secretAccessKey: this.s3ConfigService.secretAccessKey,
      region: this.s3ConfigService.region,
    });
  }

  /**
   * @name uploadImage
   * s3 의 지정된 경로에 전달 받은 이미지 파일을 저장/수정 하는 메소드
   * @param file Express Multer 의 File 포맷의 이미지 파일
   * @param path s3 bucket 내에 위치할 경로 및 파일 이름
   * @returns 저장된 이미지 파일 url 링크, s3 file path 반환
   */
  async uploadImage(
    file: Express.Multer.File,
    pathCase: PathCase,
    pathKey: string | number,
  ): Promise<S3UploadImageRes> {
    const awsS3 = this.s3;
    const bucket: string = this.getS3Bucket();
    const fileMimeType: string = file.mimetype.split('/')[1];

    if (!fileMimeType) {
      throw new Error('[Image File Type Error ... ]');
    }

    const params = {
      Bucket: bucket,
      Key: this.s3PathSelector(pathCase, String(pathKey), fileMimeType),
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
   * @name uploadImage
   * s3 의 지정된 경로에 전달 받은 이미지 base64 string을 저장/수정 하는 메소드
   * @param base64ImageString 이미지 base64 string, default mimeType = png
   * @param pathCase s3 폴더 위치를 선택하기 위한 이미지의 소속 경우 명시
   * @param pathKey 이미지가 위치한 db table primary key
   * @returns 저장된 이미지 파일 url 링크, s3 file path 반환
   */
  async uploadImageWithBase64(
    base64ImageString: string,
    pathCase: PathCase,
    pathKey: number,
  ) {
    const awsS3 = this.s3;
    const bucket: string = this.getS3Bucket();
    const fileMimeType = 'png';

    const imgBuffer = Buffer.from(base64ImageString, 'base64');

    const params = {
      Bucket: bucket,
      Key: this.s3PathSelector(pathCase, String(pathKey), fileMimeType),
      Body: imgBuffer,
    };

    return new Promise<S3UploadImageRes>((resolve, reject) => {
      awsS3.upload(params, (err, data: S3UploadImageRes) => {
        if (err) {
          reject('[S3 Image Upload Fail ...abc] ' + err.message);
        } else {
          console.log('[S3 Image Upload SUCCESS] ');
          resolve(data);
        }
      });
    });
  }

  /**
   * @name downloadImage
   * 전달받은 s3 경로에 존재하는 이미지 파일을 blob 형태로 리턴하는 메소드
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
   * 전달받은 s3 경로에 존재하는 이미지의 http url 을 리턴하는 메소드
   * @param pathCase s3 폴더 위치를 선택하기 위한 이미지의 소속 경우 명시
   * @param pathKey 이미지가 위치한 db table primary key
   * @param mimeType 이미지 확장자 타입 (jpg, png, ... )
   * @returns 저장된 이미지 파일 접속 url 링크
   */
  async getImageUrl(
    pathCase: PathCase,
    pathKey: string,
    mimeType: string,
  ): Promise<S3GetImageUrlRes> {
    const awsS3 = this.s3;
    const bucket = this.getS3Bucket();
    const params = {
      Bucket: bucket,
      Key: this.s3PathSelector(pathCase, pathKey, mimeType),
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
   * 전달받은 s3 경로에 존재하는 이미지를 삭제하는 메소드
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
   * aws s3 image bucket 을 반환하는 클래스 내부 함수
   * @returns aws s3 bucket
   */
  private getS3Bucket(): string {
    const s3BucketName = this.s3ConfigService.s3BucketName;
    return s3BucketName;
  }

  /**
   * @name s3PathSelector
   * 이미지의 목적에 따라 s3 상의 경로를 생성하는 메소드
   * @param pathCase s3 폴더 위치를 선택하기 위한 이미지의 소속 경우 명시
   * @param pathKey 이미지가 위치한 db table primary key
   * @param mimeType 이미지 확장자 타입 (jpg, png, ... )
   * @returns s3 폴더 경로
   */
  private s3PathSelector(
    pathCase: PathCase,
    pathKey: string,
    mimeType: string,
  ) {
    switch (pathCase) {
      /* owner 의 신분증 이미지 */
      case 'ownerIdf': {
        return `owner/${pathKey}/idf.${mimeType}`;
      }
      /* store 의 대표 이미지 */
      case 'storeRep': {
        return `store/${pathKey}/storeRep.${mimeType}`;
      }
      /* store 의 사업자 등록증 이미지 */
      case 'storeBus': {
        return `store/${pathKey}/business.${mimeType}`;
      }
      /* product 의 대표 이미지 */
      case 'productRep': {
        return `product/${pathKey}/representative.${mimeType}`;
      }
      /* product 의 상세 이미지 */
      case 'productDet': {
        return `product/${pathKey}/detail.${mimeType}`;
      }
      /* product 의 추가 이미지 */
      case 'productAdd': {
        return `product/${pathKey}/additional.${mimeType}`;
      }
      default: {
        return '';
      }
    }
  }
}
