import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { MysqlConfigModule } from '../../../config/database/mysql/configuration.module';
import { MysqlConfigService } from '../../../config/database/mysql/configuration.service';
import { Store } from 'src/models/store/entities/store.entity';
import { StoreBank } from 'src/models/store/entities/store-bank.entity';
import { StorePaymethod } from 'src/models/store/entities/store-paymethod.entity';
import { Owner } from 'src/models/auth-owner/entities/owner.entity';
import { Product } from 'src/models/product/entities/product.entity';
import { ProductImage } from 'src/models/product/entities/product-image.entity';
import { ProcessedProduct } from 'src/models/product/entities/processed-product.entity';
import { WeightedProduct } from 'src/models/product/entities/weighted-product.entity';
import { OnsaleProduct } from 'src/models/product/entities/onsale-product.entity';
import { OrderChild } from 'src/models/order/entities/order-child.entity';
import { OrderParent } from 'src/models/order/entities/order-parent.entity';
// import { User } from 'src/models/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlConfigModule],
      useFactory: async (mysqlConfigService: MysqlConfigService) => ({
        type: 'mysql' as DatabaseType,
        host: mysqlConfigService.host,
        port: mysqlConfigService.port,
        username: mysqlConfigService.username,
        password: mysqlConfigService.password,
        database: mysqlConfigService.database,
        entities: [
          /**
           * @Entity 리스트 주입
           * /model 에서 정의된 entity 를 추가한다.
           */
          // User,
          Owner,
          Store,
          StoreBank,
          StorePaymethod,
          Product,
          ProductImage,
          ProcessedProduct,
          WeightedProduct,
          OnsaleProduct,
          OrderChild,
          OrderParent,
        ],
        synchronize: true,
      }),
      inject: [MysqlConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MysqlDatabaseProviderModule {}
