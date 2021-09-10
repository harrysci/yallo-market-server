import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateOrderReq from './dto/CreateOrderReq.dto';
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
      .orderBy('order_parent.order_status', 'DESC')
      .getMany();

    return data;
  }

  async getOrderChildrenList(order_number: string): Promise<OrderChildGet[]> {
    return this.orderChildRepository
      .createQueryBuilder()
      .where(`order_number = ${order_number}`)
      .getMany();
  }

  async createOrderList(req: CreateOrderReq): Promise<any> {
    //console.log(req.storeName);
    //console.log('수량:', req.orderProductArray[0].quantity);
    const rawOrderParent = await this.orderParentRepository.create({
      order_number: req.orderNumber,
      order_status: 0,
      order_total_price: req.orderTotalPrice,
      order_is_pickup: req.orderIsPickup,
      store_id: req.storeId,
      order_pay_method: req.orderPayMethod,
      order_created_at: new Date(),
      store_name: req.storeName,
    });

    await this.orderParentRepository.save(rawOrderParent);

    req.orderProductArray.map(async (each) => {
      //console.log('수량:', each.quantity);
      const rawOrderChild = await this.orderChildRepository.create({
        order_number: rawOrderParent.order_number,
        order_product_name: each.productName,
        order_quantity: each.quantity,

        order_unit_price: parseInt(each.price),
      });

      await this.orderChildRepository.save(rawOrderChild);
    });
    return await rawOrderParent;
  }

  async getLastOrderNumber(): Promise<any> {
    const rawLastOrderNumber = await this.orderParentRepository
      .createQueryBuilder('order_parent')
      .select('order_parent.order_number')
      .getMany();

    console.log(rawLastOrderNumber);
    let flag = 0;
    rawLastOrderNumber.map((each) => {
      console.log('flag:', flag);
      if (parseInt(each.order_number) > flag) {
        flag = parseInt(each.order_number);
      }
    });
    return String(flag);
  }
  // async deleteOrderOne(order_number: string): Promise
}
