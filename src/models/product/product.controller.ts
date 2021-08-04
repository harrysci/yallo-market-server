/* nestjs core library */
import { Controller, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Delete,
  Get,
  Put,
  Query,
  Param,
  Post,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';

/* Entities */
import { Product } from './entities/product.entity';

/* External Provider */
import { ProductService } from './product.service';

/* Req, Res dto */
import { CreateBarcodeProcessedProductRes } from './dto/CreateBarcodeProcessedProductRes.dto';
import { CreateBarcodeWeightedProductRes } from './dto/CreateBarcodeWeightedProductRes.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
import { updateBarcodeProductInfoReq } from './dto/updateBarcodeProductInfoReq.dto';
import { CreateBarcodeWeightedProductReq } from './dto/CreateBarcodeWeightedProductReq.dto';
import { CreateBarcodeProcessedProductReq } from './dto/CreateBarcodeProcessedProductReq.dto';
import { GetImageProductListRes } from './dto/GetImageProductListRes.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   ************************************************************************************************************************
   * Get Router
   *
   * @name getBarcodeProductInfo
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 조회
   *
   * @name getImageProductList
   * @description [소비자 모바일 애플리케이션] store_id 를 통한 상품정보 목록 조회
   *
   * @name getProductListForOwnerWeb
   * @description [점주 및 점포관리인 웹] store_id 를 통한 상품정보 목록 조회
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 조회
   * @name 상품단건조회_barcode
   * @param ownerId
   * @param barcode
   * @returns GetBarcodeProductRes; owner_id 에 해당하는 store 가 존재하고 barcode 에 해당하는 상품이 존재하는 경우 -> 상품정보 반환
   * @returns boolean; barcode 에 해당하는 상품이 존재하지 않는 경우 -> 유통상품지식뱅크 DB 에서 상품 조회 후 존재 여부를 boolean 으로 반환
   */
  @Get('/readProductData/:ownerId/:barcode')
  async getBarcodeProductInfo(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<GetBarcodeProductRes | boolean> {
    return await this.productService.getBarcodeProductInfo(ownerId, barcode);
  }

  /**
   * [소비자 모바일 애플리케이션] store_id 를 통한 상품정보 목록 조회
   * @name 상품목록조회_storeId
   * @param storeId store_id
   * @returns GetImageProductListRes[];
   */
  @Get('/getProductList/:storeId')
  async getImageProductList(
    @Param('storeId') storeId: number,
  ): Promise<GetImageProductListRes[]> {
    return await this.productService.getImageProductList(storeId);
  }

  /**
   * [점주 및 점포관리인 웹] store_id 를 통한 상품정보 목록 조회
   * @name 상품목록조회_storeId
   * @param storeId store_id
   * @returns GetProductListRes[]; 웹 요청 상품 정보 리스트 반환
   */
  @Get('info-list-admin')
  async getProductListForOwnerWeb(
    @Query('storeId', ParseIntPipe) storeId: number,
  ): Promise<GetProductListRes[]> {
    return await this.productService.getProductList(storeId);
  }

  /**
   ************************************************************************************************************************
   * Post Router
   *
   * @name uploadExcelFile
   * @description [얄로마켓 관리자 웹] excel 파일을 통한 상품목록 생성
   *
   * @name createBarcodeProcessedProduct
   * @description [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 공산품 생성
   *
   * @name createBarcodeWeightedProduct
   * @description [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 저울상품 생성
   *
   ************************************************************************************************************************
   */

  /**
   * [얄로마켓 관리자 웹] excel 파일을 통한 상품목록 생성
   * @name 상품목록생성_excel
   * @param file 상품정보 목록이 담긴 excel file
   * @param store_id store_id
   * @returns void;
   */
  @Post('upload/:store_id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('store_id') store_id: number,
  ): Promise<void> {
    return await this.productService.uploadExcelFile(file, store_id);
  }

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 공산품 생성
   * @name 공산품생성_ownerId
   * @param ownerId owner_id (PRIMARY KEY)
   * @param productData 상품 정보
   * @returns CreateBarcodeProcessedProductRes;
   */
  @Post('/createProcessedProduct/:ownerId')
  async createBarcodeProcessedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeProcessedProductReq,
  ): Promise<CreateBarcodeProcessedProductRes> {
    /**
     * @exception base64 이미지 받는 로직 추가 필요
     */
    return await this.productService.createBarcodeProcessedProduct(
      ownerId,
      productData,
    );
  }

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 저울상품 생성
   * @name 저울상품생성_ownerId
   * @param ownerId owner_id (PRIMARY KEY)
   * @param productData 상품 정보
   * @returns CreateBarcodeWeightedProductRes;
   */
  @Post('/createWeightedProduct/:ownerId')
  async createBarcodeWeightedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeWeightedProductReq,
  ): Promise<CreateBarcodeWeightedProductRes> {
    /**
     * @exception base64 이미지 받는 로직 추가 필요
     */
    return await this.productService.createBarcodeWeightedProduct(
      ownerId,
      productData,
    );
  }

  /**
   ************************************************************************************************************************
   * Put Router
   *
   * @name updateBarcodeProductInfo
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 갱신
   *
   * @name updateProductInfoForOwnerWeb
   * @description [점주 및 점포관리인 웹] product_id 릍 통한 개별 상품 정보 갱신
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 갱신
   * @name 상품정보갱신_ownerId_barcode
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @param updateProductInfo 갱신할 상품 정보
   * @returns UpdateProductInfoRes; 갱신이 완료된 상품 정보
   */
  @Put('/updateProductData/:ownerId/:barcode')
  async updateBarcodeProductInfo(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
    @Body() updateProductInfo: updateBarcodeProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    return await this.productService.updateBarcodeProductInfo(
      ownerId,
      barcode,
      updateProductInfo,
    );
  }

  /**
   * [점주 및 점포관리인 웹] product_id 릍 통한 개별 상품 정보 갱신
   * @name 상품정보갱신
   * @param updateProductInfo 수정할 상품의 product_id 와 갱신할 상품 정보
   * @returns UpdateProductInfoRes; 수정된 웹 요청 상품 정보 반환
   */
  @Put('info-update')
  async updateProductInfoForOwnerWeb(
    @Body(new ValidationPipe())
    updateProductInfo: UpdateProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    return await this.productService.updateProductInfo(updateProductInfo);
  }

  /**
   ************************************************************************************************************************
   * Delete Router
   *
   * @name deleteBarcodeProduct
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 삭제
   *
   * @name deleteProductInfoForOwnerWeb
   * @description [점주 및 점포관리인 웹] product_id 를 통한 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 삭제
   * @name 상품단건삭제_ownerId_barcode
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @returns Product; 삭제된 상품 정보
   */
  @Delete('/deleteProductData/:ownerId/:barcode')
  async deleteBarcodeProduct(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<Product> {
    return await this.productService.deleteBarcodeProduct(ownerId, barcode);
  }

  /**
   * [점주 및 점포관리인 웹] product_id 를 통한 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   * @name 상품단건삭제_productId
   * @param productId 삭제할 상품의 product_id
   * @returns void;
   */
  @Delete('info-delete')
  async deleteProductInfoForOwnerWeb(
    @Query('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return await this.productService.deleteProductInfo(productId);
  }
}
