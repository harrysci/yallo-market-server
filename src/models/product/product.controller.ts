/* nestjs core library */
import {
  Controller,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

/* Req,Res dto */
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

  @Post('upload/:store_id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('store_id') store_id: number,
  ) {
    return await this.productService.uploadExcelFile(file, store_id);
  }

  /**
   * store_id 를 통한 상품 정보 목록 조회
   * @param storeId
   * @returns
   */
  @Get('/getProductList/:storeId')
  async getImageProductList(
    @Param('storeId') storeId: number,
  ): Promise<GetImageProductListRes[]> {
    return await this.productService.getImageProductList(storeId);
  }

  /**
   * @name 가공상품_생성
   * @param ownerId 점주 id (pk)
   * @param productData 상품 정보
   * @param images [상품 대표 이미지 File Blob, 상품 상세 이미지 File Blob]
   * @returns CreateBarcodeProcessedProductRes
   */
  @Post('/createProcessedProduct/:ownerId')
  @UseInterceptors(FilesInterceptor('images', 2))
  async createBarcodeProcessedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeProcessedProductReq,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<CreateBarcodeProcessedProductRes> {
    console.log(productData);

    return await this.productService.createBarcodeProcessedProduct(
      ownerId,
      productData,
      images,
    );
  }

  /**
   * @name 저울상품_생성
   * @param ownerId 점주 id (pk)
   * @param productData 상품 정보
   * @param images [상품 대표 이미지 File Blob, 상품 상세 이미지 File Blob]
   * @returns CreateBarcodeWeightedProductRes
   */
  @Post('/createWeightedProduct/:ownerId')
  @UseInterceptors(FilesInterceptor('images', 2))
  async createBarcodeWeightedProduct(
    @Param('ownerId') ownerId: number,
    @Body() productData: CreateBarcodeWeightedProductReq,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<CreateBarcodeWeightedProductRes> {
    return await this.productService.createBarcodeWeightedProduct(
      ownerId,
      productData,
      images,
    );
  }

  /**
   * 바코드를 통한 상품 정보 조회
   * @param ownerId
   * @param barcode
   * @returns
   */
  @Get('/readProductData/:ownerId/:barcode')
  async getBarcodeProductInfo(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<GetBarcodeProductRes | boolean> {
    return await this.productService.getBarcodeProductInfo(ownerId, barcode);
  }

  /**
   * 바코드를 통한 상품 정보 갱신
   * @param ownerId
   * @param barcode
   * @param updateProductInfo
   * @returns
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
   * 바코드를 통한 상품 정보 삭제
   * @param ownerId
   * @param barcode
   * @returns
   */
  @Delete('/deleteProductData/:ownerId/:barcode')
  async deleteBarcodeProduct(
    @Param('ownerId') ownerId: number,
    @Param('barcode') barcode: string,
  ): Promise<Product> {
    return await this.productService.deleteBarcodeProduct(ownerId, barcode);
  }

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
    @Query('storeId', ParseIntPipe) storeId: number,
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
    @Body(new ValidationPipe())
    updateProductInfo: UpdateProductInfoReq,
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
    @Query('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return await this.productService.deleteProductInfo(productId);
  }
}
