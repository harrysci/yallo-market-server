import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreBank } from './entities/store-bank.entity';
import { StorePaymethod } from './entities/store-paymethod.entity';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreBank, StorePaymethod])],
  exports: [StoreService],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
