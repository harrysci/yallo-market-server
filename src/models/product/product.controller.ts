import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload/:store_id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file:Express.Multer.File,
    @Param('store_id') store_id:number ){
    //this.logger.debug(rows);
    
    console.log(store_id);
    return await this.productService.uploadExcelFile(file,store_id);
  }
}
