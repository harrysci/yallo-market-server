import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/* ENV Module */
import { AppConfigModule } from './config/app/configuration.module';

/* Authentication Module */
import { AuthModule } from './models/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
