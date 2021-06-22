import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { TestService } from './test.service';

import * as MulterS3 from 'multer-s3';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() params: any) {
    this.testService.upload(file);
  }
}
