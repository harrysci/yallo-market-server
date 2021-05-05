import { Logger } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/models/auth/auth.module';
import { AuthService } from 'src/models/auth/auth.service';
import { MysqlDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
import { Seeder } from './seeder';

/**
 * Import and provide seeder classes.
 * 더미 데이터 생성기
 * @module
 */
@Module({
  imports: [MysqlDatabaseProviderModule, AuthModule],
  providers: [AuthService, Logger, Seeder],
})
export class SeederModule {}
