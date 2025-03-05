import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Kafka } from 'kafkajs';

@Injectable()
export class ProductsService implements OnModuleInit{
    private readonly Kafka = new Kafka({brokers: ['localhost:9092']})
    private readonly consumer = this.Kafka.consumer({
        groupId: 'inventory-service'
    })
    private readonly producer = this.Kafka.producer()
    constructor(
        @InjectRepository(Products)
        private readonly productRepository: Repository<Products>
    ) { }

    async onModuleInit() {
        await this.consumer.connect()
        await this.producer.connect()
        await this.consumerOrderCreated()
    }

    async createProducts(createProductDto: CreateProductDto): Promise<Products> {
        const product = this.productRepository.create(createProductDto)
        return this.productRepository.save(product)
    }

    async fetchAllProducts(): Promise<Products[]> {
        return this.productRepository.find()
    }

    async fetchProductsById(id: number): Promise<Products> {
        const product = await this.productRepository.findOne({ where: { id } })

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} doesn't exist`)
        } else {
            console.log(`Product with ID ${id} exists`)
        }

        return product;
    }

    async deleteProductById(id: number): Promise<Products> {
        const product = await this.productRepository.findOne({ where: { id } })

        if (!product) {
            throw new NotFoundException(`Cannot delete, Product with ID ${id} not found`)
        }

        await this.productRepository.delete(id)
        console.log(`Product with ID ${id} deleted successfully`)

        return product;
    }

    async validateStock(id: number, quantity: number): Promise<{ available: boolean }> {
        const product = await this.fetchProductsById(id)

        return { available: product.quantity >= quantity }
    }

    async reduceStock(id: number, quantity: number): Promise<Products> {
        const product = await this.fetchProductsById(id)

        if (product.quantity < quantity) {
            throw new BadRequestException(`Not enough stock in Product with ID ${id} available stock is ${product.quantity}`)
        }

        product.quantity -= quantity
        return this.productRepository.save(product);
    }

    async consumerOrderCreated () {
        await this.consumer.subscribe({
            topic: `order-created`
        })

        await this.consumer.run({
            eachMessage: async ({message}) => {
                const parsedMessage = JSON.parse(message.value.toString());
    console.log('Received message:', parsedMessage);
                console.log('new message arrived..................')
                const {customerId, items, city} = JSON.parse(
                    message.value.toString()
                )

                for(const item of items){
                    await this.reduceStock(item.productId, item.quantity)
                }

                await this.producer.send({
                    topic: `order-inventory-update`,
                    messages: [
                        {value: JSON.stringify({customerId, items, city})}
                    ]
                })
            }
        
            
        })
    }


}
