import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import * as XLSX from 'xlsx';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleExcel(@UploadedFile() file){
    const workbook= XLSX.read(file.buffer, {type: 'buffer'});
    const sheetName= workbook.SheetNames[0];

    const sheet= workbook.Sheets[sheetName];

    const rows= XLSX.utils.sheet_to_json(sheet, {
      defval:null,
    });
    
  }

}
