import { OnsaleProduct } from "../entities/onsale-product.entity"
import { ProcessedProduct } from "../entities/processed-product.entity"
import { ProductImage } from "../entities/product-image.entity"
import { WeightedProduct } from "../entities/weighted-product.entity"

export class ProductDto {
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
}