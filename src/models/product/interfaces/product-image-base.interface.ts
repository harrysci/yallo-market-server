import { Product } from '../entities/product.entity';

/**
 * @interface ProductImageBase
 * product_image entity base interface
 */
export interface ProductImageBase {
  product_image_id: number;
  product_image: string;
  is_representative: boolean;
  is_detail: boolean;
  is_additional: boolean;

  product: Product;
}
