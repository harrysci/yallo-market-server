import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreBank } from './entities/store-bank.entity';
import { StorePaymethod } from './entities/store-paymethod.entity';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(StoreBank)
    private readonly storeBankRepository: Repository<StoreBank>,

    @InjectRepository(StorePaymethod)
    private readonly storePaymethodRepository: Repository<StorePaymethod>,
  ) {}
}
