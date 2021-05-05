import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { MysqlConfigService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * AWS RDS MySQL 환경변수 제공 Module
 * joi 의 내장 객체 유효성 검사기를 통해 필수 환경변수정의를 검사한다.
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        RDS_MYSQL_HOST: Joi.string(),
        RDS_MYSQL_PORT: Joi.number().default(3306),
        RDS_MYSQL_USERNAME: Joi.string().default('admin'),
        RDS_MYSQL_PASSWORD: Joi.string().default('admin'),
        RDS_MYSQL_DATABASE: Joi.string().default('mysql'),
      }),
    }),
  ],
  providers: [ConfigService, MysqlConfigService],
  exports: [ConfigService, MysqlConfigService],
})
export class MysqlConfigModule {}
