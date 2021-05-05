import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/configuration.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { Seeder } from './database/seeders/seeder';

async function bootstrap() {
  /* Create NestExpress Server APP */
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /* Project ENV 환경 로드 */
  const appConfig: AppConfigService = app.get('AppConfigService');

  /* ENV dev PORT 적용 */
  await app.listen(appConfig.port);
  // .then((appContext) => {
  //   const logger = appContext.get(Logger);
  //   const seeder = appContext.get(Seeder);
  //   seeder
  //     .seed()
  //     .then(() => {
  //       logger.debug('Seeding complete!');
  //     })
  //     .catch((error) => {
  //       logger.error('Seeding failed!');
  //       throw error;
  //     })
  //     .finally(() => appContext.close());
  // })
  // .catch((error) => {
  //   throw error;
  // });
}
bootstrap();
