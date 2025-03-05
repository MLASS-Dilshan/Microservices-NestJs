import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { OrderItem } from 'src/entity/order-item.entity';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports : [TypeOrmModule.forFeature([Order, OrderItem])]
})
export class OrdersModule {}
