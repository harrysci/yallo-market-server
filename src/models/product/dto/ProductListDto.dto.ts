import { OnsaleProduct } from '../entities/onsale-product.entity';
import { ProcessedProduct } from '../entities/processed-product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { WeightedProduct } from '../entities/weighted-product.entity';

export class ProductListDto {
  // product 공통 attributes
  product_id: number;
  store_id: number;
  product_barcode: string;
  product_name: string;
  product_original_price: number;
  product_current_price: number;
  product_profit: number;
  product_description: string;
  product_is_processed: boolean;
  product_is_soldout: boolean;
  product_onsale: boolean;
  product_category: string;
  product_created_at: Date;
  product_image: ProductImage[];
  processed_product: ProcessedProduct[];
  weighted_product: WeightedProduct[];
  onsale_product: OnsaleProduct[];

  // processed_product attributes
  processed_product_id?: number;
  processed_product_name?: string;
  processed_product_company?: string;
  processed_product_standard_type?: string;
  processed_product_standard_values?: string;
  processed_product_composition?: string;
  processed_product_volume?: string;
  processed_product_adult?: string;
  processed_product_caution?: string;
  processed_product_information?: string;

  // weighted_product attributes
  weighted_product_id?: number;
  weighted_product_volume?: string;
}