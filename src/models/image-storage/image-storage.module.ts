import { Module } from '@nestjs/common';
import { S3ConfigModule } from 'src/config/aws/s3/configuration.module';
import { ImageStorageService } from './image-storage.service';

@Module({
  imports: [S3ConfigModule],
  exports: [ImageStorageService],
  providers: [ImageStorageService],
})
export class ImageStorageModule {}
