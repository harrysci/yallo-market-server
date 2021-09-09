import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';
import { OrderChildGet } from './dto/OrderChildGet.dto';
import { OrderParentGet } from './dto/OrderParentGet.dto';
import { OrderChild } from './entities/order-child.entity';
import { OrderParent } from './entities/order-parent.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderParent)
    private readonly orderParentRepository: Repository<OrderParent>,
    @InjectRepository(OrderChild)
    private readonly orderChildRepository: Repository<OrderChild>,
  ) {}

  async getOrderParentList(): Promise<OrderParentGet[]> {
    const data = await this.orderParentRepository.find();
    return data;
  }

  async getOrderChildrenList(order_number: string): Promise<OrderChildGet[]> {
    return this.orderChildRepository
      .createQueryBuilder()
      .where(`order_number = ${order_number}`)
      .getMany();
  }

  // async deleteOrderOne(order_number: string): Promise
}
