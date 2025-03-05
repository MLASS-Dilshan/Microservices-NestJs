import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kafka } from 'kafkajs';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { OrderStatus, UpdateOrderStatus } from 'src/dto/update-order.dto';
import { OrderItem } from 'src/entity/order-item.entity';
import { Order } from 'src/entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService implements OnModuleInit{
    private readonly Kafka = new Kafka ({brokers: ['localhost:9092']})
    private readonly producer = this.Kafka.producer()
    private readonly consumer = this.Kafka.consumer({
        groupId: `order-service`
    })
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>

    ) { }

    async onModuleInit() {
        await this.producer.connect()
        await this.consumer.connect()
        await this.consumeConfirmedOrders()
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<any> {

        const { customerId, items, city } = createOrderDto;



        // const order = this.orderRepository.create({
        //     customerId,
        //     status: 'PENDING',
        //     city
        // })

        // const savedOrder = await this.orderRepository.save(order)

        // const orderItems = items.map((item) =>
        //     this.orderItemRepository.create({
        //         productId: item.productId,
        //         price: item.price,
        //         quantity: item.quantity,
        //         order: savedOrder
        //     })
        // )

        // const savedOrderItem = await this.orderItemRepository.save(orderItems)

        this.producer.send({
            topic:  `order-created`,
            messages: [
                {value: JSON.stringify({customerId, items, city})}
            ]
            
        })

        return{ message: `order is placed, waiting for inventory service`}
    }

    async getAllOrders(){
        return await this.orderRepository.find({relations: ['items']})
    }

    async updateOrderStaus(id: number, updateStatus: UpdateOrderStatus) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order) {
          throw new NotFoundException(`order with id: ${id} is not found`);
        }
        if (
          order.status === OrderStatus.DELIVERED ||
          order.status === OrderStatus.CANCELLED
        ) {
          throw new BadRequestException(
            `order status cannot be changed when its delivered or cancelled`,
          );
        }
        order.status = updateStatus.status;
        return await this.orderRepository.save(order);
      }

      async consumeConfirmedOrders() {
    await this.consumer.subscribe({
      topic: 'order-inventory-update',
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        console.log(`---------------- new order confirmation arrived---------`);
        const { customerId, items, city } = JSON.parse(message.value.toString());
        //save to db

        const order = this.orderRepository.create({
          customerId,
          status: OrderStatus.CONFIRMED,
          city,
        });
        const savedOrder = await this.orderRepository.save(order);

        const orderItems = items.map((item) =>
          this.orderItemRepository.create({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
            order: savedOrder,
          }),
        );

        await this.orderItemRepository.save(orderItems);
      },
    });
  }
}
