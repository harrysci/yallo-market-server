import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/* ENV Module */
import { AppConfigModule } from './config/app/configuration.module';

/* MySQL Database Module */
import { MysqlDatabaseProviderModule } from './providers/database/mysql/provider.module';
import { GCPMysqlDatabaseProviderModule } from './providers/database/mysql-dev/provider.module';

/* Authentication Module */
import { AuthModule } from './models/auth/auth.module';
import { TestModule } from './src/models/test/test.module';

@Module({
  imports: [
    GCPMysqlDatabaseProviderModule,
    MysqlDatabaseProviderModule,
    AppConfigModule,
    AuthModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
