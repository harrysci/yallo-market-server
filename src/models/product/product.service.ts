import { HttpException, HttpService, Injectable } from '@nestjs/common';

/* typeorm */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Excel file 처리 */
import * as XLSX from 'xlsx';

/* External Provider */
import { StoreService } from '../store/store.service';
import { KorchamConfigService } from '../../config/korcham/configuration.service';
import { ImageStorageService } from '../image-storage/image-storage.service';
import { S3UploadImageRes } from '../image-storage/interfaces/s3UploadImageRes.interface';

/* Entities */
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { Store } from '../store/entities/store.entity';

/* Req,Res dto */
import { StoreIdNameRes } from '../store/dto/StoreIdNameRes.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
import { updateBarcodeProductInfoReq } from './dto/updateBarcodeProductInfoReq.dto';
import { CreateBarcodeProcessedProductReq } from './dto/CreateBarcodeProcessedProductReq.dto';
import { CreateBarcodeProcessedProductRes } from './dto/CreateBarcodeProcessedProductRes.dto';
import { CreateBarcodeWeightedProductReq } from './dto/CreateBarcodeWeightedProductReq.dto';
import { CreateBarcodeWeightedProductRes } from './dto/CreateBarcodeWeightedProductRes.dto';
import { GetImageProductListRes } from './dto/GetImageProductListRes.dto';

/* test dummy data */
import dummy from './dummy/dummyBase64';

/**
 * @name 상품_Provider_Class
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProcessedProduct)
    private readonly processedProductRepository: Repository<ProcessedProduct>,

    @InjectRepository(WeightedProduct)
    private readonly weightedProductRepository: Repository<WeightedProduct>,

    @InjectRepository(OnsaleProduct)
    private readonly onSaleProductRepository: Repository<OnsaleProduct>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly storeService: StoreService,

    private readonly httpService: HttpService,

    private readonly korchamConfig: KorchamConfigService,

    private readonly imageStorageService: ImageStorageService, // s3 image storage service
  ) {}

  /**
   ************************************************************************************************************************
   * Get Method
   *
   * @name getBarcodeProductInfo
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 조회
   *
   * @name getImageProductList
   * @description [소비자 모바일 애플리케이션] store_id 를 통한 상품정보 목록 조회
   *
   * @name getProductList (getProductListForOwnerWeb)
   * @description [점주 및 점포관리인 웹] store_id 를 통한 상품정보 목록 조회
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 조회
   * @param ownerId
   * @param barcode
   * @returns GetBarcodeProductRes;
   *   1. ownerId, barcode 에 해당하는 상품이 product 테이블에 존재하는 경우 -> product:GetBarcodeProductRes
   * @returns boolean;
   *   2. ownerId, barcode 에 해당하는 상품이 product 테이블에 존재하지 않는 경우
   *      (2-1). 유통상품지식뱅크 DB 에서 조회가 되는 경우 -> true
   *      (2-2). 유통상품지식뱅크 DB 에서 조회가 되지 않는 경우 -> false
   */
  async getBarcodeProductInfo(
    ownerId: number,
    barcode: string,
  ): Promise<GetBarcodeProductRes | boolean> {
    const rawProduct: Product = await this.getImageProductByOwnerIdAndBarcode(
      ownerId,
      barcode,
    );

    /**
     * 해당 product 가 존재하는 경우 -> product 를 GetBarcodeProductRes 로 formatting 후 반환
     * 해당 product 가 존재하지 않는 경우 -> 유통상품지식뱅크 DB 조회 후 존재 여부 boolean 반환
     */
    try {
      if (rawProduct) {
        // GetBarcodeProductRes 로 formatting
        const product: GetBarcodeProductRes = {
          productBarcode: rawProduct.product_barcode,
          productCategory: rawProduct.product_category,
          productCreatedAt: rawProduct.product_created_at,
          productCurrentPrice: rawProduct.product_current_price,
          productName: rawProduct.product_name,
          productOnsale: rawProduct.product_onsale,
          productVolume: rawProduct.product_is_processed
            ? // 공산품인 경우 -> processed_product.processed_product_volume
              rawProduct.processed_product.processed_product_volume
            : // 저울상품인 경우 -> weighted_product.weighted_product_volume
              rawProduct.weighted_product.weighted_product_volume,
          storeName: rawProduct.store.store_name,
          productImages: rawProduct.product_image,
          productOnsalePrice: rawProduct.product_onsale
            ? rawProduct.onsale_product.product_onsale_price
            : null,
        };

        return product;
      } else {
        const isPresent: any = await this.requestKorchamApi(barcode);

        if (isPresent) return true;
      }

      return false;
    } catch {
      throw new Error(
        `[getBarcodeProductInfo Error] key Error, not exist ownerId: ${ownerId} or barcode: ${barcode}`,
      );
    }
  }

  /**
   * [소비자 모바일 애플리케이션] store_id 를 통한 상품정보 목록 조회
   * @param storeId store_id
   * @returns GetImageProductListRes;
   */
  async getImageProductList(
    storeId: number,
  ): Promise<GetImageProductListRes[]> {
    /**
     * 1. product 와 product_image, processed_product, weighted_product, onsale_product 를 left join -> rawImageProductList 에 저장
     * 2. rawImageProductList 를 GetImageProductListRes 형태에 맞게 formatting
     * 3. imageProductList return
     */

    const rawImageProductList = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id=:store_id', { store_id: storeId })
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .getMany();

    const imageProductList: GetImageProductListRes[] =
      rawImageProductList.map<GetImageProductListRes>((each) => ({
        productId: each.product_id,
        storeId: storeId,
        productBarcode: each.product_barcode,
        productName: each.product_name,
        productOriginalPrice: each.product_original_price,
        productCurrentPrice: each.product_current_price,
        productProfit: each.product_profit,
        productDescription: each.product_description,
        productIsProcessed: each.product_is_processed,
        productIsSoldout: each.product_is_soldout,
        productOnsale: each.product_onsale,
        productCategory: each.product_category,
        productCreatedAt: each.product_created_at,

        representativeProductImageId: each.product_image[0].product_image_id,
        representativeProductImage: each.product_image[0].product_image,
        detailProductImageId: each.product_image[1].product_image_id,
        detailProductImage: each.product_image[1].product_image,
        additionalProductImageId:
          each.product_image[2] && each.product_image[2].product_image_id,
        additionalProductImage:
          each.product_image[2] && each.product_image[2].product_image,

        processedProductId:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_id,

        processedProductName:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_name,
        processedProductCompany:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_company,
        processedProductStandardType:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_standard_type,
        processedProductStandardValues:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_standard_values,
        processedProductComposition:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_composition,
        processedProductVolume:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_volume,
        processedProductAdult:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_adult,
        processedProductCaution:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_caution,
        processedProductInformation:
          each.product_is_processed == false
            ? null
            : each.processed_product.processed_product_information,

        weightedProductId:
          each.product_is_processed == true
            ? null
            : each.weighted_product.weighted_product_id,
        weightedProductVolume:
          each.product_is_processed == true
            ? null
            : each.weighted_product.weighted_product_volume,

        OnsaleProductId:
          each.product_onsale == true
            ? each.onsale_product.onsale_product_id
            : null,
        productOnsalePrice:
          each.product_onsale == true
            ? each.onsale_product.product_onsale_price
            : null,
      }));

    return imageProductList;
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 상품 목록 조회
   * @param storeId store_id
   * @returns GetProductListRes[]; 웹 요청 상품 정보 리스트 반환
   * @추가error 존재하지 않는 store key 에 대해 throw error
   */
  async getProductList(storeId: number) {
    /* Database 조회 결과 */
    const selectProductListRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id = :store_id', { store_id: storeId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .getMany();

    if (!selectProductListRawResult) {
      throw new Error('getProductList [Get] Not Exist store Key  ... ');
    }

    /* 점주 및 점포 관리인 WEB 상품 정보 리스트 조회 결과로 변환*/
    const productList: GetProductListRes[] =
      selectProductListRawResult.map<GetProductListRes>((eachProduct) => ({
        productId: eachProduct.product_id,
        productBarcode: eachProduct.product_barcode,
        productName: eachProduct.product_name,
        productOriginPrice: eachProduct.product_original_price,
        productCurrentPrice: eachProduct.product_current_price,
        productOnSalePrice: eachProduct.onsale_product
          ? eachProduct.onsale_product.product_onsale_price
          : null,
        productProfit: eachProduct.product_profit,
        productIsProcessed: eachProduct.product_is_processed,
        productOnSale: eachProduct.product_onsale,
        productVolume: eachProduct.processed_product
          ? eachProduct.processed_product.processed_product_volume
          : eachProduct.weighted_product.weighted_product_volume,
      }));

    return productList;
  }

  /**
   ************************************************************************************************************************
   * Post Method
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
   * @param file
   * @param store_id
   */
  async uploadExcelFile(
    file: Express.Multer.File,
    store_id: number,
  ): Promise<void> {
    const workBook: XLSX.WorkBook = XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
    });
    /*첫번째 sheet이름 사용*/
    const sheetName = workBook?.SheetNames[0];
    // console.log(sheetName);
    /*sheet의 전체 정보*/
    const sheet: XLSX.WorkSheet = workBook.Sheets[sheetName];
    /*json 파일 변환*/
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    });
    /*store 정보*/
    const newStore = await this.storeService.getStore(store_id);
    jsonData.map(async (iter) => {
      /*save할 data*/
      const ExcelData = new Product();
      if (iter['바코드'] != null) {
        ExcelData.store = newStore;
        ExcelData.product_barcode = iter['바코드'].toString();
        ExcelData.product_name = iter['상품명'];
        ExcelData.product_original_price = iter['원가'];
        ExcelData.product_current_price = iter['판가'];
        ExcelData.product_description = iter['상품상세설명'];
        ExcelData.product_profit =
          iter['원가'] == 0
            ? 0
            : 100 * ((iter['판가'] - iter['원가']) / iter['원가']);
        ExcelData.product_is_processed =
          ExcelData.product_barcode.slice(0, 3) == '880' ? true : false;
        ExcelData.product_is_soldout = iter['재고'] == 0 ? true : false;
        ExcelData.product_onsale = false;
        ExcelData.product_category = iter['분류이름'];
        if (ExcelData.product_is_processed) {
          const processedData = new ProcessedProduct();
          processedData.processed_product_name = iter['상품명'];
          processedData.processed_product_adult = 'N';
          processedData.processed_product_company = iter['상품회사'];
          processedData.processed_product_standard_type = iter['규격'];
          processedData.processed_product_standard_values = iter['규격'];
          processedData.processed_product_composition = iter['상품구성'];
          processedData.processed_product_volume = iter['총중량'];
          processedData.processed_product_caution = iter['주의사항'];
          ExcelData.processed_product = processedData;
        } else {
          const weightedData = new WeightedProduct();
          weightedData.weighted_product_volume = iter['상품의 양'];
          ExcelData.weighted_product = weightedData;
        }
        const onsaleData = new OnsaleProduct();
        onsaleData.product_onsale_price = iter['할인판가']
          ? iter['할인판가']
          : 0;
        ExcelData.onsale_product = onsaleData;

        await this.productRepository.save(ExcelData);
      }
    });
  }

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 공산품 생성
   * @param ownerId
   * @param productData
   * @return createdProduct
   */
  async createBarcodeProcessedProduct(
    ownerId: number,
    productData: CreateBarcodeProcessedProductReq,
    images: Express.Multer.File[],
  ): Promise<CreateBarcodeProcessedProductRes> {
    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);

    // ownerId 에 해당하는 store 가 존재하지 않는 경우
    if (!storeIdName)
      throw new Error(
        `[createBarcodeProcessedProduct Error] no store was found by owner_id: ${ownerId}`,
      );

    // owner_id 에 해당하는 store 불러오기
    const store: Store = await this.storeService.getStore(storeIdName.storeId);

    // 중복 상품 검사 실시
    const isNew: boolean = await this.checkDupplicatedProductByStoreAndBarcode(
      store,
      productData.productBarcode,
    );

    // 중복된 상품이 존재하지 않는 경우 -> 생성
    if (isNew) {
      //
      /**
       * requestKorchamApi private method 를 사용해서 유통상품지식뱅크 DB 조회
       * -> 공산품 정보 불러오기
       * 아직 test 못함.
       */
      // const test: any = this.requestKorchamApi(productData.productBarcode);
      // console.log(test);

      // 공산품 정보 생성 및 저장
      const processed_product = this.processedProductRepository.create({
        processed_product_adult: 'adult dummy',
        processed_product_caution: 'caution dummy',
        processed_product_company: 'company dummy',
        processed_product_composition: 'composition dummy',
        processed_product_information: 'information dummy',
        processed_product_name: 'name dummy',
        processed_product_standard_type: 'type dummy',
        processed_product_standard_values: 'values dummy',
        processed_product_volume: 'volume dummy',
      });
      await this.processedProductRepository.save(processed_product);

      // 상품 정보 생성 및 저장
      const product = this.productRepository.create({
        product_barcode: productData.productBarcode,
        product_name: productData.productName,
        product_original_price: productData.productOriginPrice,
        product_current_price: productData.productCurrentPrice,
        product_profit:
          ((productData.productCurrentPrice - productData.productOriginPrice) /
            productData.productCurrentPrice) *
          100,
        product_description: productData.productDescription,
        product_is_processed: productData.productIsProcessed,
        product_is_soldout: productData.productIsSoldout,
        product_onsale: false,
        product_category: '가공상품',
        product_created_at: productData.productCreatedAt,

        store: store,
        onsale_product: null,
        processed_product: processed_product,
        weighted_product: null,
      });
      const newTempProcessedProduct = await this.productRepository.save(
        product,
      );

      // 생성한 상품 조회
      const rawCreatedProduct: Product =
        await this.getImageProductByOwnerIdAndBarcode(
          ownerId,
          productData.productBarcode,
        );

      // CreateBarcodeProcessedProductRes 로 formatting
      const createdProduct: CreateBarcodeProcessedProductRes = {
        // representativeProductImage:
        //   rawCreatedProduct.product_image[0].product_image,
        // detailProductImage: rawCreatedProduct.product_image[1].product_image,
        // additionalProductImage:
        //   rawCreatedProduct.product_image[2].product_image,

        representativeProductImage: '',
        detailProductImage: '',
        additionalProductImage: '',

        productBarcode: rawCreatedProduct.product_barcode,
        productCategory: rawCreatedProduct.product_category,
        productCreatedAt: rawCreatedProduct.product_created_at,
        productCurrentPrice: rawCreatedProduct.product_current_price,
        productDescription: rawCreatedProduct.product_description,
        productId: rawCreatedProduct.product_id,
        productIsProcessed: rawCreatedProduct.product_is_processed,
        productIsSoldout: rawCreatedProduct.product_is_soldout,
        productName: rawCreatedProduct.product_name,
        productOnsale: rawCreatedProduct.product_onsale,
        productOriginalPrice: rawCreatedProduct.product_original_price,
        productProfit: rawCreatedProduct.product_profit,
        processedProductCaution:
          rawCreatedProduct.processed_product.processed_product_caution,
        processedProductCompany:
          rawCreatedProduct.processed_product.processed_product_company,
        processedProductComposition:
          rawCreatedProduct.processed_product.processed_product_composition,
        processedProductId:
          rawCreatedProduct.processed_product.processed_product_id,
        processedProductInformation:
          rawCreatedProduct.processed_product.processed_product_information,
        processedProductName:
          rawCreatedProduct.processed_product.processed_product_name,
        processedProductStandardType:
          rawCreatedProduct.processed_product.processed_product_standard_type,
        processedProductStandardValues:
          rawCreatedProduct.processed_product.processed_product_standard_values,
        processedProductVolume:
          rawCreatedProduct.processed_product.processed_product_volume,
        processedProductAdult:
          rawCreatedProduct.processed_product.processed_product_adult,
      };

      /* s3 이미지 저장 */
      const repImageFromS3: S3UploadImageRes =
        await this.imageStorageService.uploadImage(
          images[0],
          'productRep',
          newTempProcessedProduct.product_id,
        );
      const detailImageFromS3: S3UploadImageRes =
        await this.imageStorageService.uploadImage(
          images[1],
          'productDet',
          newTempProcessedProduct.product_id,
        );

      // 상품 대표 이미지 생성 및 저장
      const representativeImage: ProductImage =
        this.productImageRepository.create({
          is_additional: false,
          is_detail: false,
          is_representative: true,
          product: product,
          product_image: repImageFromS3.Location, // s3 에 저장된 이미지의 s3 url
        });
      await this.productImageRepository.save(representativeImage);

      // 상품 상세 이미지 생성 및 저장
      const detailImage: ProductImage = this.productImageRepository.create({
        is_additional: false,
        is_detail: true,
        is_representative: false,
        product: product,
        product_image: detailImageFromS3.Location, // s3 에 저장된 이미지의 s3 url
      });
      await this.productImageRepository.save(detailImage);

      /**
       * @exception 추가 이미지 생성 및 저장 로직 주석 처리
       * 추가 이미지 촬영이 추가 된 이후 해제
       */
      // 상품 추가 이미지 생성 및 저장
      // const additionalImage: ProductImage = this.productImageRepository.create({
      //   is_additional: true,
      //   is_detail: false,
      //   is_representative: false,
      //   product: product,
      //   product_image: productData.additionalProductImage,
      // });
      // await this.productImageRepository.save(additionalImage);

      createdProduct.representativeProductImage = repImageFromS3.Location;
      createdProduct.detailProductImage = detailImageFromS3.Location;

      return createdProduct;
    }
    // 상품이 중복된 경우 -> throw Error
    else {
      throw new HttpException(
        `[createBarcodeProcessedProduct Error] duplicated product with owner_id: ${ownerId}, store_id: ${storeIdName.storeId}, product_barcode: ${productData.productBarcode}`,
        401,
      );
    }
  }

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] owner_id 를 통한 저울상품 생성
   * @param ownerId
   * @param productData
   * @return createdProduct
   */
  async createBarcodeWeightedProduct(
    ownerId: number,
    productData: CreateBarcodeWeightedProductReq,
    images: Express.Multer.File[],
  ): Promise<CreateBarcodeWeightedProductRes> {
    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);

    // ownerId 에 해당하는 store 가 존재하지 않는 경우
    if (!storeIdName)
      throw new Error(
        `[createBarcodeWeightedProduct Error] no store was found by owner_id: ${ownerId}`,
      );

    // owner_id 에 해당하는 store 불러오기
    const store: Store = await this.storeService.getStore(storeIdName.storeId);

    // 저울상품 정보 생성 및 저장
    const weighted_product = this.weightedProductRepository.create({
      weighted_product_volume: productData.productVolume,
    });
    await this.weightedProductRepository.save(weighted_product);

    // 중복 상품 검사 실시
    const isNew: boolean = await this.checkDupplicatedProductByStoreAndBarcode(
      store,
      productData.productBarcode,
    );

    // 중복된 상품이 존재하지 않는 경우 -> 생성
    if (isNew) {
      // 상품 정보 생성 및 저장
      const product = this.productRepository.create({
        product_barcode: productData.productBarcode,
        product_name: productData.productName,
        product_original_price: productData.productOriginPrice,
        product_current_price: productData.productCurrentPrice,
        product_profit:
          ((productData.productCurrentPrice - productData.productOriginPrice) /
            productData.productCurrentPrice) *
          100,
        product_description: productData.productDescription,
        product_is_processed: productData.productIsProcessed,
        product_is_soldout: productData.productIsSoldout,
        product_onsale: false,
        product_category: '저울상품',
        product_created_at: productData.productCreatedAt,

        store: store,
        onsale_product: null,
        processed_product: null,
        weighted_product: weighted_product,
      });
      await this.productRepository.save(product);
      const newTempWeightedProduct = await this.productRepository.save(product);

      // 생성한 상품 조회
      const rawCreatedProduct: Product =
        await this.getImageProductByOwnerIdAndBarcode(
          ownerId,
          productData.productBarcode,
        );

      // CreateBarcodeWeightedProductRes 로 formatting
      const createdProduct: CreateBarcodeWeightedProductRes | any = {
        productId: rawCreatedProduct.product_id,
        productBarcode: rawCreatedProduct.product_barcode,
        productName: rawCreatedProduct.product_name,
        productOriginalPrice: rawCreatedProduct.product_original_price,
        productCurrentPrice: rawCreatedProduct.product_current_price,
        productProfit: rawCreatedProduct.product_profit,
        productDescription: rawCreatedProduct.product_description,
        productIsProcessed: rawCreatedProduct.product_is_processed,
        productIsSoldout: rawCreatedProduct.product_is_soldout,
        productOnsale: rawCreatedProduct.product_onsale,
        productCategory: rawCreatedProduct.product_category,
        productCreatedAt: rawCreatedProduct.product_created_at,

        // representativeProductImage:
        //   rawCreatedProduct.product_image[0].product_image,
        // detailProductImage: rawCreatedProduct.product_image[1].product_image,
        // additionalProductImage:
        //   rawCreatedProduct.product_image[2].product_image,

        representativeProductImage: '',
        detailProductImage: '',
        additionalProductImage: '',

        weightedProductId:
          rawCreatedProduct.weighted_product.weighted_product_id,
        weightedProductVolume:
          rawCreatedProduct.weighted_product.weighted_product_volume,
      };

      /* s3 이미지 저장 */
      const repImageFromS3: S3UploadImageRes =
        await this.imageStorageService.uploadImage(
          images[0],
          'productRep',
          newTempWeightedProduct.product_id,
        );
      const detailImageFromS3: S3UploadImageRes =
        await this.imageStorageService.uploadImage(
          images[1],
          'productDet',
          newTempWeightedProduct.product_id,
        );

      // 상품 대표 이미지 생성 및 저장
      const representativeImage: ProductImage =
        this.productImageRepository.create({
          is_additional: false,
          is_detail: false,
          is_representative: true,
          product: product,
          product_image: repImageFromS3.Location,
        });
      await this.productImageRepository.save(representativeImage);

      // 상품 상세 이미지 생성 및 저장
      const detailImage: ProductImage = this.productImageRepository.create({
        is_additional: false,
        is_detail: true,
        is_representative: false,
        product: product,
        product_image: detailImageFromS3.Location,
      });
      await this.productImageRepository.save(detailImage);

      /**
       * @exception 추가 이미지 생성 및 저장 로직 주석 처리
       * 추가 이미지 촬영이 추가 된 이후 해제
       */
      // 상품 추가 이미지 생성 및 저장
      // const additionalImage: ProductImage = this.productImageRepository.create({
      //   is_additional: true,
      //   is_detail: false,
      //   is_representative: false,
      //   product: product,
      //   product_image: productData.additionalProductImage,
      // });
      // await this.productImageRepository.save(additionalImage);

      createdProduct.representativeProductImage = repImageFromS3.Location;
      createdProduct.detailProductImage = detailImageFromS3.Location;

      return createdProduct;
    }
    // 상품이 중복된 경우 -> throw Error
    else {
      throw new Error(
        `[createBarcodeWeightedProduct Error] duplicated product with owner_id: ${ownerId}, store_id: ${storeIdName.storeId}, product_barcode: ${productData.productBarcode}`,
      );
    }
  }

  /**
   ************************************************************************************************************************
   * Put Method
   *
   * @name updateBarcodeProductInfo
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 갱신
   *
   * @name updateProductInfo (updateProductInfoForOwnerWeb)
   * @description [점주 및 점포관리인 웹] product_id 릍 통한 개별 상품 정보 갱신
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 갱신
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @param updateProductInfo
   * @returns UpdateProductInfoRes;
   *   1. ownerId, barcode 에 해당하는 상품이 product 테이블에 존재하는 경우 -> updatedProduct:updateBarcodeProductInfoRes
   *   2. 존재하지 않는 경우 -> [deleteBarcodeProduct Error] no product was found by owner_id: ${ownerId}, product_barcode: ${barcode}
   *   3. 삭제에 실패한 경우 -> [deleteBarcodeProduct Error] deletion error
   */
  async updateBarcodeProductInfo(
    ownerId: number,
    barcode: string,
    updateProductInfo: updateBarcodeProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    const rawProduct: Product = await this.getProductByOwnerIdAndBarcode(
      ownerId,
      barcode,
    );

    /**
     * 해당 product 가 존재하는 경우 -> updateProductInfo 로 전달받은 정보로 상품정보를 갱신하고 DB 에서 상품을 조회한 결과를 반환
     * 해당 product 가 존재하지 않는 경우 -> throw Error
     */
    if (rawProduct) {
      /**
       * 공산품인 경우 -> processed_product 정보 갱신
       * 저울상품인 경우 -> weighted_product 정보 갱신
       */
      if (rawProduct.product_is_processed) {
        rawProduct.processed_product = {
          ...rawProduct.processed_product,
          processed_product_volume: updateProductInfo.productVolume,
        };
      } else {
        rawProduct.weighted_product = {
          ...rawProduct.weighted_product,
          weighted_product_volume: updateProductInfo.productVolume,
        };
      }

      /**
       * 갱신된 상품 정보 DB 저장
       */
      try {
        // processed_product, weighted_product 저장
        await this.productRepository.save(rawProduct);

        // product 저장
        await this.productRepository
          .createQueryBuilder('product')
          .update(Product)
          .where('product.product_id=:productId', {
            productId: updateProductInfo.productId,
          })
          .set({
            product_barcode: updateProductInfo.productBarcode,
            product_name: updateProductInfo.productName,
            product_current_price: updateProductInfo.productCurrentPrice,
            product_category: updateProductInfo.productCategory,
            product_created_at: updateProductInfo.productCreatedAt,
            product_is_soldout: updateProductInfo.productIsSoldout,
            product_original_price: updateProductInfo.productOriginPrice,
            product_description: updateProductInfo.productDescription,
            product_profit: rawProduct.product_onsale
              ? // 상품이 할인 중인 경우
                ((rawProduct.onsale_product.product_onsale_price -
                  updateProductInfo.productOriginPrice) /
                  rawProduct.onsale_product.product_onsale_price) *
                100
              : // 상품이 할인 중이지 않은 경우
                ((updateProductInfo.productCurrentPrice -
                  updateProductInfo.productOriginPrice) /
                  updateProductInfo.productCurrentPrice) *
                100,
          })
          .execute();
      } catch {
        throw new Error(
          `[updateBarcodeProductInfo Error] update error by ${ownerId}, product_barcode: ${barcode}`,
        );
      }
    } else {
      throw new Error(
        `[updateBarcodeProductInfo Error] no product was found by owner_id: ${ownerId}, product_barcode: ${barcode}`,
      );
    }

    const rawUpdatedProduct: Product =
      await this.getImageProductByOwnerIdAndBarcode(
        ownerId,
        updateProductInfo.productBarcode,
      );

    // updateBarcodeProductInfoRes 로 formatting
    const updatedProduct: UpdateProductInfoRes = {
      productBarcode: rawUpdatedProduct.product_barcode,
      productCurrentPrice: rawUpdatedProduct.product_current_price,
      productId: rawUpdatedProduct.product_id,
      productIsProcessed: rawUpdatedProduct.product_is_processed,
      productName: rawUpdatedProduct.product_name,
      productOnSale: rawUpdatedProduct.product_onsale,
      productOnSalePrice:
        rawUpdatedProduct.onsale_product &&
        rawUpdatedProduct.product_onsale &&
        rawUpdatedProduct.onsale_product.product_onsale_price
          ? rawUpdatedProduct.onsale_product.product_onsale_price
          : null,
      productOriginPrice: rawUpdatedProduct.product_original_price,
      productProfit: rawUpdatedProduct.product_profit,
      productVolume: rawUpdatedProduct.product_is_processed
        ? // 공산품인 경우 -> processed_product.processed_product_volume
          rawProduct.processed_product.processed_product_volume
        : // 저울상품인 경우 -> weighted_product.weighted_product_volume
          rawProduct.weighted_product.weighted_product_volume,
    };

    return updatedProduct;
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 정보 수정
   * @param updateProductInfo 수정할 상품의 id 및 수정할 상품 정보
   * @returns UpdateProductInfoRes; 수정된 웹 요청 상품 정보 반환
   * @추가error 존재하지 않는 product key 에 대해 throw error
   */
  async updateProductInfo(
    updateProductInfo: UpdateProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    /* product id 를 통해 원본 데이터 조회 */
    const selectProductRawResult: Product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', {
        product_id: updateProductInfo.productId,
      })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .getOne();

    if (!selectProductRawResult) {
      throw new Error('updateProductInfo [Update] Not Exist product Key  ... ');
    }

    /**
     * 1. processed product 정보 수정
     * 2. weighted product 정보 수정
     * 3. on sale product 정보 수정
     */
    if (selectProductRawResult.processed_product) {
      selectProductRawResult.processed_product = {
        ...selectProductRawResult.processed_product,
        processed_product_volume: updateProductInfo.productVolume,
      };
    } else {
      selectProductRawResult.weighted_product = {
        ...selectProductRawResult.weighted_product,
        weighted_product_volume: updateProductInfo.productVolume,
      };
    }

    if (
      selectProductRawResult.onsale_product &&
      updateProductInfo.productOnSale
    ) {
      /* 기존 OnSale 이면서 수정 정보가 OnSale 인 경우 */
      selectProductRawResult.onsale_product = {
        ...selectProductRawResult.onsale_product,
        product_onsale_price: updateProductInfo.productOnSalePrice,
      };
    } else if (
      /* 기존 OnSale 이면서 수정 정보가 OnSale 인 경우 */
      selectProductRawResult.onsale_product &&
      !updateProductInfo.productOnSale
    ) {
      const deleteTarget = selectProductRawResult.onsale_product;
      selectProductRawResult.onsale_product = null;
      await this.productRepository.save(selectProductRawResult);
      await this.onSaleProductRepository.remove(deleteTarget);
    } else if (
      !selectProductRawResult.onsale_product &&
      updateProductInfo.productOnSale
    ) {
      /* 기존 OnSale 이 아니면서 수정 정보가 OnSale 인 경우 */
      const newOnsaleProduct = new OnsaleProduct();
      newOnsaleProduct.product_onsale_price =
        updateProductInfo.productOnSalePrice;

      selectProductRawResult.onsale_product = newOnsaleProduct;
    }

    try {
      /* 수정한 정보 적용 */
      await this.productRepository.save(selectProductRawResult);

      /* product 정보 수정 */
      await this.productRepository
        .createQueryBuilder('product')
        .update(Product)
        .where('product.product_id = :product_id', {
          product_id: updateProductInfo.productId,
        })
        .set({
          product_barcode: updateProductInfo.productBarcode,
          product_name: updateProductInfo.productName,
          product_original_price: updateProductInfo.productOriginPrice,
          product_current_price: updateProductInfo.productCurrentPrice,
          product_profit: updateProductInfo.productProfit,
          product_onsale: updateProductInfo.productOnSale,
        })
        .execute();

      /* 수정된 DB 정보 조회 */
      const selectUpdatedProductRawResult: Product =
        await this.productRepository
          .createQueryBuilder('product')
          .where('product.product_id = :product_id', {
            product_id: updateProductInfo.productId,
          })
          .leftJoinAndSelect('product.onsale_product', 'onsale_product')
          .leftJoinAndSelect('product.weighted_product', 'weighted_product')
          .leftJoinAndSelect('product.processed_product', 'processed_product')
          .getOne();

      /* 점주 및 점포 관리인 상품 정보 수정 요청 결과로 변환 */
      const updatedProductInfo: UpdateProductInfoRes = {
        productId: selectUpdatedProductRawResult.product_id,
        productBarcode: selectUpdatedProductRawResult.product_barcode,
        productName: selectUpdatedProductRawResult.product_name,
        productOriginPrice:
          selectUpdatedProductRawResult.product_original_price,
        productCurrentPrice:
          selectUpdatedProductRawResult.product_current_price,
        productOnSalePrice: selectUpdatedProductRawResult.onsale_product
          ? selectUpdatedProductRawResult.onsale_product.product_onsale_price
          : null,
        productProfit: selectUpdatedProductRawResult.product_profit,
        productIsProcessed: selectUpdatedProductRawResult.product_is_processed,
        productOnSale: selectUpdatedProductRawResult.product_onsale,
        productVolume: selectUpdatedProductRawResult.processed_product
          ? selectUpdatedProductRawResult.processed_product
              .processed_product_volume
          : selectUpdatedProductRawResult.weighted_product
              .weighted_product_volume,
      };
      return updatedProductInfo;
    } catch (e) {
      throw new Error('updateProductInfo [Update] Error :' + e.message);
    }
  }

  /**
   ************************************************************************************************************************
   * Delete Method
   *
   * @name deleteBarcodeProduct
   * @description [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 삭제
   *
   * @name deleteProductInfo (deleteProductInfoForOwnerWeb)
   * @description [점주 및 점포관리인 웹] product_id 를 통한 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   *
   ************************************************************************************************************************
   */

  /**
   * [점주 및 점포관리인 모바일 애플리케이션] product_barcode 를 통한 상품 정보 삭제
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @returns Product;
   *   1. ownerId, barcode 에 해당하는 상품이 product 테이블에 존재하는 경우 -> 상품을 삭제하고 해당 상품 정보 반환 (rawProduct:Product)
   *   2. 존재하지 않는 경우 -> [updateBarcodeProductInfo Error] no product was found by owner_id: ${ownerId}, product_barcode: ${barcode}
   *   3. 갱신에 실패한 경우 -> [updateBarcodeProductInfo Error] update error by ${ownerId}, product_barcode: ${barcode}
   */
  async deleteBarcodeProduct(
    ownerId: number,
    barcode: string,
  ): Promise<Product> {
    const rawProduct: Product = await this.getImageProductByOwnerIdAndBarcode(
      ownerId,
      barcode,
    );

    /**
     * 해당 product 가 존재하는 경우 -> 상품 삭제
     * 해당 product 가 존재하지 않는 경우 -> throw Error
     */
    if (rawProduct) {
      try {
        // product_image 테이블에서 상품 이미지 삭제
        if (rawProduct.product_image.length) {
          await this.productImageRepository
            .createQueryBuilder('product_image')
            .delete()
            .from(ProductImage)
            .where('product_image.product_id=:productId', {
              productId: rawProduct.product_id,
            })
            .execute();
        }

        // product 테이블에서 상품 삭제
        await this.productRepository.remove(rawProduct);

        // processed_product 테이블에서 공산품 상세정보 삭제
        if (rawProduct.processed_product) {
          const deleteTarget: ProcessedProduct =
            await this.processedProductRepository.findOne({
              processed_product_id:
                rawProduct.processed_product.processed_product_id,
            });
          await this.processedProductRepository.remove(deleteTarget);
        }

        // weighted_product 테이블에서 저울 식품 상세정보 삭제
        if (rawProduct.weighted_product) {
          const deleteTarget: WeightedProduct =
            await this.weightedProductRepository.findOne({
              weighted_product_id:
                rawProduct.weighted_product.weighted_product_id,
            });

          await this.weightedProductRepository.remove(deleteTarget);
        }

        // onsale_product 테이블에서 상품 할인정보 삭제
        if (rawProduct.onsale_product) {
          const deleteTarget: OnsaleProduct =
            await this.onSaleProductRepository.findOne({
              onsale_product_id: rawProduct.onsale_product.onsale_product_id,
            });

          await this.onSaleProductRepository.remove(deleteTarget);
        }
      } catch {
        throw new Error('[deleteBarcodeProduct Error] deletion error');
      }
    } else {
      throw new Error(
        `[deleteBarcodeProduct Error] no product was found by owner_id: ${ownerId}, product_barcode: ${barcode}`,
      );
    }

    return rawProduct;
  }

  /**
   * [점주 및 점포관리인 웹] product_id 를 통한 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   * @param productId 삭제할 상품의 product_id
   * @returns void;
   * @추가error 존재하지 않는 product key 에 대해 throw error
   */
  async deleteProductInfo(productId: number): Promise<void> {
    /* product id 를 통해 원본 데이터 조회 */
    const selectTargetProductRawResult: Product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', { product_id: productId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .getOne();

    if (!selectTargetProductRawResult) {
      throw new Error('deleteProductInfo [Delete] Not Exist product Key  ... ');
    }

    try {
      /* 1. foreign key 의 대상(1:N) relation table raws 삭제 */
      if (selectTargetProductRawResult.product_image.length === 0) {
        await this.productImageRepository
          .createQueryBuilder('product_image')
          .delete()
          .where('product_image.product_id = :product_id', {
            product_id: selectTargetProductRawResult.product_id,
          })
          .execute();
      }

      /* 2. foreign key 를 가진 해당 product 삭제 */
      await this.productRepository.remove(selectTargetProductRawResult);

      /* 3. foreign key 의 대상(1:1) relation table raw 삭제 */
      if (selectTargetProductRawResult.onsale_product) {
        /* 3-1. onSaleProduct 가 존재하는 경우 삭제 */
        const target = await this.onSaleProductRepository.findOne({
          onsale_product_id:
            selectTargetProductRawResult.onsale_product.onsale_product_id,
        });
        await this.onSaleProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.processed_product) {
        /* 3-2. processedProduct 가 존재하는 경우 삭제 */
        const target = await this.processedProductRepository.findOne({
          processed_product_id:
            selectTargetProductRawResult.processed_product.processed_product_id,
        });
        await this.processedProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.weighted_product) {
        /* 3-2. weightedProduct 가 존재하는 경우 삭제 */
        const target = await this.weightedProductRepository.findOne({
          weighted_product_id:
            selectTargetProductRawResult.weighted_product.weighted_product_id,
        });
        await this.weightedProductRepository.remove(target);
      }
    } catch (e) {
      throw new Error('deleteProductInfo [Delete] Error : ' + e.message);
    }
  }

  /**
   ************************************************************************************************************************
   * Private Method
   *
   * @name requestKorchamApi
   * @description 한국 유통DB에 바코드정보 조회 메서드
   *
   * @name checkDupplicatedProductByStoreAndBarcode
   * @description 중복 상품 검사
   *
   * @name getProductByOwnerIdAndBarcode
   * @description 상품단건조회
   *
   * @name getImageProductByOwnerIdAndBarcode
   * @description 이미지 포함 상품단건조회
   *
   ************************************************************************************************************************
   */

  /**
   * 한국 유통DB에 바코드정보 조회 메서드
   * @link https://www.notion.so/API-4639f996fc7842f19b845cd7c9b9c1c8
   * @param barcode product_barcode
   * @returns AxiosRequest<Dto>; (notion db명세 참조)
   * 
   * 메서드동작: korcham API 에 GET 요청 후 리턴값 반환
     - KorchamAPI -
       request: GET.
       header : Content-Type, yallomarket appkey,
       url: korchamurl/{barcode},
   */
  private async requestKorchamApi(barcode: string): Promise<any> {
    const headerRequest = new Headers();
    headerRequest.append('Content-Type', 'application/json:charset=utf-8');
    headerRequest.append(
      'Authorization',
      `appkey: ${this.korchamConfig.appkey}`,
    );

    return await this.httpService.get(
      `${this.korchamConfig.apiurl}/${barcode}`,
      {
        headers: headerRequest,
      },
    );
  }

  /**
   * 중복 상품 검사
   * @param store Store
   * @param barcode product_barcode
   * @returns boolean;
   *   1. store 에 이미 barcode 로 등록된 상품이 존재하는 경우 (중복 O) -> false
   *   2. store 에 barcode 로 등록된 상품이 존재하지 않는 경우 (중복 X) -> true
   */
  private async checkDupplicatedProductByStoreAndBarcode(
    store: Store,
    barcode: string,
  ) {
    const dupCheck = await this.productRepository.findOne({
      store: store,
      product_barcode: barcode,
    });
    if (dupCheck) return false;

    return true;
  }

  /**
   * 상품단건조회
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @returns Product;
   */
  private async getProductByOwnerIdAndBarcode(
    ownerId: number,
    barcode: string,
  ): Promise<Product> {
    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);

    if (!storeIdName || storeIdName === undefined) {
      throw new Error(
        `[getImageProductByOwnerIdAndBarcode Error] no store was found by owner_id: ${ownerId}`,
      );
    }

    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.store=:storeId', { storeId: storeIdName.storeId })
        .andWhere('product.product_barcode=:barcode', { barcode: barcode })
        .leftJoinAndSelect('product.processed_product', 'processed_product')
        .leftJoinAndSelect('product.weighted_product', 'weighted_product')
        .leftJoinAndSelect('product.onsale_product', 'onsale_product')
        .getOne();

      return product;
    } catch {
      throw new Error(
        `[getProductByOwnerIdAndBarcode Error] some error found by owner_id: ${ownerId} and barcode: ${barcode}`,
      );
    }
  }

  /**
   * 이미지 포함 상품단건조회
   * @param ownerId owner_id
   * @param barcode product_barcode
   * @returns Product;
   */
  private async getImageProductByOwnerIdAndBarcode(
    ownerId: number,
    barcode: string,
  ): Promise<Product> {
    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);

    if (!storeIdName)
      throw new Error(
        `[getImageProductByOwnerIdAndBarcode Error] no store was found by owner_id: ${ownerId}`,
      );

    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store=:storeId', { storeId: storeIdName.storeId })
      .andWhere('product.product_barcode=:barcode', { barcode: barcode })
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .getOne();

    if (!product) {
      throw new Error(
        `[getImageProductByOwnerIdAndBarcode Error] no product was found by owner_id: ${ownerId} and barcode: ${barcode}`,
      );
    }

    const resProduct: Product = {
      ...product,
      store: await this.storeService.getStore(storeIdName.storeId),
    };

    return resProduct;
  }
}
