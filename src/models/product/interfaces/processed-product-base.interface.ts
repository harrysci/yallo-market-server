import { Product } from '../entities/product.entity';

/**
 * @interface ProcessedProductBase
 * processed_product entity base interface
 */
export interface ProcessedProductBase {
  processed_product_id: number;
  processed_product_name: string;
  processed_product_company: string;
  processed_product_standard_type: string;
  processed_product_standard_values: string;
  processed_product_composition: string;
  processed_product_volume: string;
  processed_product_adult: string;
  processed_product_caution: string;
  processed_product_information: string;
}
