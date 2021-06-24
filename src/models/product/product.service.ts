import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { UploadExcelDataDto } from './dto/UploadExcelDataDto.dto';


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

  async uploadExcelFile(file: Express.Multer.File, store_id:number): Promise<Product>{
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
    console.log(jsonData[0]);
    /*store 객체생성*/
    const newStore = await this.storeService.getStore(store_id);

    const ExcelData= new Product();
    ExcelData.store=newStore;
    ExcelData.product_barcode= jsonData[0]['바코드'].toString();
    ExcelData.product_name= jsonData[0]['상품명'];
    ExcelData.product_original_price= jsonData[0]['원가'];
    ExcelData.product_current_price= jsonData[0]['판가'];
    ExcelData.product_description= '맛있다';
    ExcelData.product_profit=jsonData[0]['원가']/jsonData[0]['판가'];
    ExcelData.product_is_processed=
        ExcelData.product_barcode.slice(0,3)=='880'
        ? true: false;
    ExcelData.product_is_soldout=
        jsonData[0]['재고']==0
        ? true: false;
    ExcelData.product_onsale=false;
    ExcelData.product_category= jsonData[0]['분류이름'];
    
    if(ExcelData.product_is_processed){
    }
    else{

    }

      
      // product_barcode: jsonData[0]['바코드'],
      // product_name: jsonData[0]['상품명'],
      // product_original_price: jsonData[0]['원가'],
      // product_current_price: jsonData[0]['판가'],
      
      // product_description: '맛있다',
      // product_onsale_price: 0,
      // product_category: jsonData[0]['분류이름'],
      // product_profit: jsonData[0]['원가']/jsonData[0]['판가'],
      // product_is_processed: 
      //   jsonData[0]['바코드']=='880'
      //   ? true: false,
      // product_is_soldout: 
      //   jsonData[0]['재고']==0
      //   ? true: false,
      // product_onsale: false,
      
      
      // product_volume: '100kg',
      // processed_product:{

      // }
      // product_created_at: 
      // product_image!: ProductImage[];
      // processed_product: ProcessedProduct;
      // weighted_product: WeightedProduct;
      // onsale_product: OnsaleProduct;

    console.log(ExcelData);
    return await this.productRepository.save(ExcelData);
    
  }
}
