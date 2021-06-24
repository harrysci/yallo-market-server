import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBarcodeProcessedProductDto } from './dto/CreateBarcodeProcessedProductDto.dto';
import { CreateBarcodeWeightedProductDto } from './dto/CreateBarcodeWeightedProductDto.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // processed product 생성
  @Post('/createProduct/:ownerId')
  async createBarcodeProcessedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeProcessedProductDto,
  ): Promise<any> {
    return await this.productService.createBarcodeProcessedProduct(
      ownerId,
      productData,
    );
  }

  // weighted product 생성
  @Post('/createProduct/:ownerId')
  async createBarcodeWeightedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeWeightedProductDto,
  ): Promise<any> {
    return await this.productService.createBarcodeWeightedProduct(
      ownerId,
      productData,
    );
  }

  // 바코드를 통한 상품 정보 조회
  @Get('/readProductData/:ownerId/:barcode')
  async getBarcodeProductInfo(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<GetBarcodeProductRes> {
    return await this.productService.getBarcodeProductInfo(ownerId, barcode);
  }

  // 바코드를 통한 상품 정보 갱신
  @Patch('/updateProductData/:ownerId/:barcode')
  async updateBarcodeProductInfo(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<any> {
    return await this.productService.updateBarcodeProductInfo(ownerId, barcode);
  }

  // 바코드를 통한 상품 정보 삭제
  @Delete('/deleteProductData/:ownerId/:barcode')
  async deleteBarcodeProduct(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<any> {
    return await this.productService.deleteBarcodeProduct(ownerId, barcode);
  }
}

// service 구현
// Promise type 변경
