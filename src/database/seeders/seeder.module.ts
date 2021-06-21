import { Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AuthCustomerModule } from 'src/models/auth-customer/auth-customer.module';
import { AuthCustomerService } from 'src/models/auth-customer/auth-customer.service';
import { MysqlDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
import { Seeder } from './seeder';

/**
 * Import and provide seeder classes.
 * 더미 데이터 생성기
 * @module
 */
@Module({
  imports: [MysqlDatabaseProviderModule, AuthCustomerModule],
  providers: [AuthCustomerService, Logger, Seeder],
})
export class SeederModule {}
