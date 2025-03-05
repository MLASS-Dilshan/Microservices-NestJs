import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/entity/order.entity';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { UpdateOrderStatus } from 'src/dto/update-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService : OrdersService
    ) {}

    @Post()
    async createOrder(@Body() createOrderDto : CreateOrderDto) :Promise<Order> {
        return await this.ordersService.createOrder(createOrderDto)
    }

    @Get()
    async getAllOrders(){
        return await this.ordersService.getAllOrders()
    }

    @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatus: UpdateOrderStatus,
  ) {
    return await this.ordersService.updateOrderStaus(id, updateOrderStatus);
  }
}
