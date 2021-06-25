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
    //console.log(jsonData);
    const ExcelData=new Product();
    const newStore = await this.storeService.getStore(store_id);
    
    const ExcelDataArray=Array().fill(ExcelData).map(async (each)=>{
      jsonData.map((iter)=>{
        console.log(iter['바코드']);
        if(iter['바코드'].toString()!=null){
          each.store=newStore;
          each.product_barcode=iter['바코드'].toString();
          each.product_name= iter['상품명'];
          each.product_original_price= iter['원가'];
          each.product_current_price= iter['판가'];
          each.product_description= iter['상품상세설명'];
          each.product_profit=100*((iter['판가']-iter['원가'])/iter['원가']);
          each.product_is_processed=
          each.product_barcode.slice(0,3)=='880'
          ? true: false;
          each.product_is_soldout=
          iter['재고']==0
          ? true: false;
          each.product_onsale=false;
          each.product_category= iter['분류이름'];
          if(each.product_is_processed){
            const processedData=new ProcessedProduct();
            processedData.
            processed_product_name=iter['상품명'];
            processedData.
            processed_product_adult="N";
            processedData.
            processed_product_company=iter['상품회사']
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
            each.processed_product=processedData;
        }
        else{
          const weightedData=new WeightedProduct();
          weightedData.
          weighted_product_volume=iter['상품의 양'];
          each.weighted_product=weightedData;
        }
        }
      })
    })
      //await this.productRepository.save(each);
    console.log(ExcelDataArray);
  }
}
