import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity Schema for Product
 * @class Product
 */
@Entity({
  name: 'product',
})
export class Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  product_id: number;
}
