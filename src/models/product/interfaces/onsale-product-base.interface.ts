import { Product } from '../entities/product.entity';

/**
 * @interface OnsaleProductBase
 * product_image entity base interface
 */
export interface OnsaleProductBase {
  onsale_product_id: number;
  product_onsale_price: number;
}
