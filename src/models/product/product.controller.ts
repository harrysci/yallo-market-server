import {
  Body,
  Controller,
  Delete,
  Get,
  Put, 
  Query,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBarcodeProcessedProductDto } from './dto/CreateBarcodeProcessedProductDto.dto';
import { CreateBarcodeWeightedProductDto } from './dto/CreateBarcodeWeightedProductDto.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { Product } from './entities/product.entity';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
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
  ): Promise<Product> {
    return await this.productService.deleteBarcodeProduct(ownerId, barcode);
  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/

  /**
   * 점주 및 점포 관리인 웹 대시보드 상품 목록 조회
   * @param storeId 가게 id
   * @returns GetProductListRes[], 웹 요청 상품 정보 리스트 반환
   */
  @Get('info-list-admin')
  async getProductListForOwnerWeb(
    @Query('storeId') storeId: number,
  ): Promise<GetProductListRes[]> {
    return await this.productService.getProductList(storeId);
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 정보 수정
   * @param updateProductInfo 수정할 상품의 id 및 수정할 상품 정보
   * @returns UpdateProductInfoRes , 수정된 웹 요청 상품 정보 반환
   */
  @Put('info-update')
  async updateProductInfoForOwnerWeb(
    @Body() updateProductInfo: UpdateProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    return await this.productService.updateProductInfo(updateProductInfo);
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   * @param productId 삭제할 상품의 id
   * @returns void
   */
  @Delete('info-delete')
  async deleteProductInfoForOwnerWeb(
    @Query('productId') productId: number,
  ): Promise<void> {
    return await this.productService.deleteProductInfo(productId);
  }
}

// service 구현
// Promise type 변경
