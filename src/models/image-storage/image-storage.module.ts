import { Module } from '@nestjs/common';
import { ImageStorageService } from './image-storage.service';

@Module({
  providers: [ImageStorageService]
})
export class ImageStorageModule {}
