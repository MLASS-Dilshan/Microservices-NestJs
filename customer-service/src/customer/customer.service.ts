import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository : Repository<Customer>
    ) {}

    async createCustomer (
        createCustomerDto : CreateCustomerDto
    ): Promise<Customer> {
        const customer = this.customerRepository.create(createCustomerDto)
        return this.customerRepository.save(customer);
    }

    async fetchAllCustomers (): Promise <Customer[]> {
        return this.customerRepository.find()
    }

    async fetchCustomerById (id : number): Promise<Customer> {
        const customer = await this.customerRepository.findOne({where : {id}})

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`)
        } else {
            console.log(`Customer with ID ${id} exists`)
        }

        return customer;
    }

    async deleteCustomerById (id : number): Promise<Customer> {
        const customer = await this.customerRepository.findOne({where : {id}})

        if (!customer) {
            throw new NotFoundException(`Cannot delete, because customer with ID ${id} does not exist`)
        } 

        await this.customerRepository.delete(id)
        console.log(`Customer with ID ${id} deleted successfully`)

        return customer;
    }
}
