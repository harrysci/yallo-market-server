import { Module } from '@nestjs/common';
import { S3ConfigModule } from 'src/config/aws/s3/configuration.module';
import { ImageStorageModule } from '../image-storage/image-storage.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [S3ConfigModule, ImageStorageModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
