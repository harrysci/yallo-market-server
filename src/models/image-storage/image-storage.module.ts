import { Module } from '@nestjs/common';
import { S3ConfigModule } from 'src/config/aws/s3/configuration.module';
import { ImageStorageService } from './image-storage.service';

/**
 * @module AWSS3ImageStorage
 * @description
 * 이미지 저장, 조회, 수정, 삭제가 필요한 모듈에서 imports: [ImageStorageModule] 적용 이후
 * ImageStorageService 를 주입받아 사용한다.
 */
@Module({
  imports: [S3ConfigModule],
  exports: [ImageStorageService],
  providers: [ImageStorageService],
})
export class ImageStorageModule {}
