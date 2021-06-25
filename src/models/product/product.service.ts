import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { UploadExcelArrayDto } from './dto/UploadExcelArrayDto.dto';

import { StoreService } from '../store/store.service';
import { promises } from 'fs';
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

    private readonly storeService: StoreService,
  ) {}

  async uploadExcelFile(file: Express.Multer.File, store_id:number): Promise<void>{
    const workBook: XLSX.WorkBook=XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
    });
    /*첫번째 sheet이름 사용*/
    const sheetName=workBook?.SheetNames[0];
    console.log(sheetName);
    /*sheet의 전체 정보*/
    const sheet: XLSX.WorkSheet=workBook.Sheets[sheetName];
    /*json 파일 변환*/
    const jsonData=XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    })
    /*store 정보*/
    const newStore = await this.storeService.getStore(store_id);
    jsonData.map(async (iter)=>{
      /*save할 data*/
      const ExcelData=new Product();
      if(iter['바코드']!=null){
        ExcelData.store=newStore;
        ExcelData.product_barcode=iter['바코드'].toString();
        ExcelData.product_name= iter['상품명'];
        ExcelData.product_original_price= iter['원가'];
        ExcelData.product_current_price= iter['판가'];
        ExcelData.product_description= iter['상품상세설명'];
        ExcelData.product_profit=
        iter['원가']==0?0:100*((iter['판가']-iter['원가'])/iter['원가']);
        ExcelData.product_is_processed=
        ExcelData.product_barcode.slice(0,3)=='880'
        ? true: false;
        ExcelData.product_is_soldout=
        iter['재고']==0
        ? true: false;
        ExcelData.product_onsale=false;
        ExcelData.product_category= iter['분류이름'];
        if(ExcelData.product_is_processed){
          const processedData=new ProcessedProduct();
          processedData.
          processed_product_name=iter['상품명'];
          processedData.
          processed_product_adult="N";
          processedData.
          processed_product_company=iter['상품회사'];
          processedData.
          processed_product_standard_type=iter['규격'];
          processedData.
          processed_product_standard_values=iter['규격'];
          processedData.
          processed_product_composition=iter['상품구성'];
          processedData.
          processed_product_volume=iter['총중량'];
          processedData.
          processed_product_caution=iter['주의사항'];
          ExcelData.processed_product=processedData;
        }
        else{
          const weightedData=new WeightedProduct();
          weightedData.
          weighted_product_volume=iter['상품의 양'];
          ExcelData.weighted_product=weightedData;
        }
        const onsaleData=new OnsaleProduct();
        onsaleData.product_onsale_price=iter['할인판가']?
        iter['할인판가']:0;
        ExcelData.onsale_product=onsaleData;

        await this.productRepository.save(ExcelData);
      }
    })
    /*Array사용시 저장할 Promise함수*/
    //Promise.all(ExcelDataArray).then(async function(values){
      //console.log(values);
      //await this.productRepository.save(values);
    //})
  }
}
