export class CreateBarcodeProcessedProductDto {
  productBarcode: string;
  productName: string;
  productOriginalPrice: number;
  productCurrentPrice: number;
  productDescription: string;
  productIsSoldout: boolean;
  productCreatedAt: Date;

  productOnsale: boolean;
  productOnsalePrice?: number;
}
