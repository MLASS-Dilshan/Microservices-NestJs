import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>

    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<any> {

        const { customerId, items, city } = createOrderDto;



        const order = this.orderRepository.create({
            customerId,
            status: 'PENDING',
            city
        })

        const savedOrder = await this.orderRepository.save(order)

        const orderItems = items.map((item) =>
            this.orderItemRepository.create({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
                order: savedOrder
            })
        )

        const savedOrderItem = await this.orderItemRepository.save(orderItems)
    }

    async getAllOrders(){
        return await this.orderRepository.find({relations: ['items']})
    }
}
