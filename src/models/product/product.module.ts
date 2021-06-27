import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { StoreModule } from '../store/store.module';
import { KorchamConfigModule } from 'src/config/korcham/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProcessedProduct,
      WeightedProduct,
      OnsaleProduct,
    ]),
    StoreModule,
    HttpModule,
    KorchamConfigModule,
  ],
  exports: [ProductService],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
