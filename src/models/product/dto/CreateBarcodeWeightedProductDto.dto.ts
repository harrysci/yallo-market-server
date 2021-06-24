export class CreateBarcodeWeightedProductDto {
  productBarcode: string;
  productName: string;
  productOriginalPrice: number;
  productCurrentPrice: number;
  productCategory: string;
  productCreatedAt: Date;

  representativeProductImage: string;
  detailProductImage: string;
  additionalProductImage: string;

  productOnsale: boolean;
  productOnsalePrice?: number;
}
