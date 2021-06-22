import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestService } from './test.service';

import { ImageStorageService } from '../image-storage/image-storage.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() params: any,
  ) {
    const image = await this.imageStorageService.uploadImage(
      file,
      'test/test/',
    );

    console.log(image);
  }
}
