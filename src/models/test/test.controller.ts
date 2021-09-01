import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
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
      'ownerIdf',
      3,
    );
  }

  @Get('download')
  async downloadFile(@Query('path') path) {
    const res = await this.imageStorageService.downloadImage(path);
    // console.log(res);
    return res;
  }

  @Delete('remove')
  async deleteFile(@Query('path') req) {
    const res = await this.imageStorageService.deleteImage(req[0]);
    return res;
  }
}
