import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/* ENV Config Module */
import { AppConfigModule } from './config/app/configuration.module';

/* MySQL Database Module */
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
// import { GCPMysqlDatabaseProviderModule } from './providers/database/mysql-dev/provider.module';

/* Authentication Module */
import { AuthCustomerModule } from './models/auth-customer/auth-customer.module';
import { AuthOwnerController } from './models/auth-owner/auth-owner.controller';
import { AuthOwnerModule } from './models/auth-owner/auth-owner.module';
import { StoreController } from './models/store/store.controller';
import { StoreModule } from './models/store/store.module';
import { ProductModule } from './models/product/product.module';
import { TestModule } from './models/test/test.module';

@Module({
  imports: [
    // GCPMysqlDatabaseProviderModule,
    MysqlDatabaseProviderModule,
    AppConfigModule,
    AuthCustomerModule,
    AuthOwnerModule,
    StoreModule,
    ProductModule,
    TestModule,
  ],
  controllers: [AppController, AuthOwnerController, StoreController],
  providers: [AppService],
})
export class AppModule {}
