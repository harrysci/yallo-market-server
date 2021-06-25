import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { OnsaleProduct } from './entities/onsale-product.entity';
<<<<<<< HEAD
import { StoreModule } from '../store/store.module';
=======
import { KorchamConfigModule } from 'src/config/korcham/configuration.module';
>>>>>>> a3d995553075e54a35baa93915a3625daccc2b1c

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProcessedProduct,
      WeightedProduct,
      OnsaleProduct,
    ]),
<<<<<<< HEAD
    StoreModule,
=======
    HttpModule,
    KorchamConfigModule,
>>>>>>> a3d995553075e54a35baa93915a3625daccc2b1c
  ],
  exports: [ProductService],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
