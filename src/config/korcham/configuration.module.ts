import * as Joi from '@hapi/joi'; /* 유효성검사 */
import korchamConfig from './korcham.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KorchamConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [korchamConfig],
      validationSchema: Joi.object({
        APP_KEY: Joi.string(),
        API_URL: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, KorchamConfigService],
  exports: [ConfigService, KorchamConfigService],
})
export class KorchamConfigModule {}
