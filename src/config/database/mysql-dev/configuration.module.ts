import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { GCPMysqlConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * GCP Cloud Storage SQL 환경변수 제공 Module
 * joi 의 내장 객체 유효성 검사기를 통해 필수 환경변수정의를 검사한다.
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        GCP_MYSQL_HOST: Joi.string(),
        GCP_MYSQL_PORT: Joi.number().default(3306),
        GCP_MYSQL_USERNAME: Joi.string().default('admin'),
        GCP_MYSQL_PASSWORD: Joi.string().default('admin'),
        GCP_MYSQL_DATABASE: Joi.string().default('mysql'),
      }),
    }),
  ],
  providers: [ConfigService, GCPMysqlConfigService],
  exports: [ConfigService, GCPMysqlConfigService],
})
export class GCPMysqlConfigModule {}
