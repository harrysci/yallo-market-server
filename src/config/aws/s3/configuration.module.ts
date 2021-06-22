import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { S3ConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * AWS S3 Storage 환경변수 제공 Module
 * joi 의 내장 객체 유효성 검사기를 통해 필수 환경변수정의를 검사한다.
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AWS_S3_BUCKET_NAME: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_REGION: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, S3ConfigService],
  exports: [ConfigService, S3ConfigService],
})
export class S3ConfigModule {}
