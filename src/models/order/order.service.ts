import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
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

  async getOrderParentList(): Promise<OrderParentGet[] | any> {
    const data = await this.orderParentRepository
      .createQueryBuilder('order_parent')
      .innerJoinAndMapOne(
        'order_parent.store_id',
        Store,
        'store',
        'order_parent.store_id = store.store_id',
      )
      .getMany();

    // const list_item = await data.map((item: any) => {
    //   return this.orderChildRepository
    //     .createQueryBuilder()
    //     .where(`order_number = ${item.order_number}`)
    //     .getMany();
    // });
    // console.log(list_item);
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
