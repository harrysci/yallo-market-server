export class PayProductDto {
  storeName: string;
  productName: string;
  quantity: number;
  price: string;
  repImageUri: string;
  detailImageUri: string;
  isSale: boolean;
  saleRatio?: number;
  originalPrice?: number;
}
