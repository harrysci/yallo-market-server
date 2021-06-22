import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AWS S3 Storage Access ENV
 * @class env method 집합
 */
@Injectable()
export class S3ConfigService {
  constructor(private configService: ConfigService) {}

  get accessKey(): string {
    return this.configService.get<string>('aws-s3.accessKey');
  }
  get secretAccessKey(): string {
    return this.configService.get<string>('aws-s3.secretAccessKey');
  }
  get region(): string {
    return this.configService.get<string>('aws-s3.region');
  }
  get s3BucketName(): string {
    return this.configService.get<string>('aws-s3.s3BucketName');
  }
}
