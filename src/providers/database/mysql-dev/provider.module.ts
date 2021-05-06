import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from 'src/models/auth/entities/user.entity';
import { GCPMysqlConfigService } from 'src/config/database/mysql-dev/configuration.service';
import { GCPMysqlConfigModule } from 'src/config/database/mysql-dev/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [GCPMysqlConfigModule],
      useFactory: async (gcpMysqlConfigService: GCPMysqlConfigService) => ({
        type: 'mysql' as DatabaseType,
        host: gcpMysqlConfigService.host,
        port: gcpMysqlConfigService.port,
        username: gcpMysqlConfigService.username,
        password: gcpMysqlConfigService.password,
        database: gcpMysqlConfigService.database,
        entities: [
          /**
           * @Entity 리스트 주입
           * /model 에서 정의된 entity 를 추가한다.
           */
          User,
        ],
        synchronize: true,
      }),
      inject: [GCPMysqlConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class GCPMysqlDatabaseProviderModule {}
