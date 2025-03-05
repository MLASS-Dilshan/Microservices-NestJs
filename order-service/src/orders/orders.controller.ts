import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/entity/order.entity';
import { CreateOrderDto } from 'src/dto/create-order.dto';

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
}
