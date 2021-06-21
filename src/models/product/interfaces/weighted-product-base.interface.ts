import { Product } from '../entities/product.entity';

/**
 * @interface WeightedProductBase
 * weighted_product entity base interface
 */
export interface WeightedProductBase {
  weighted_product_id: number;
  weighted_product_volume: string;

  product: Product;
}
