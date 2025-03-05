import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entity/customer.entity';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService : CustomerService) {}

    @Post()
    async createCustomer (
        @Body() createCustomerDto : CreateCustomerDto,
    ): Promise <Customer> {
        return this.customerService.createCustomer(createCustomerDto)
    }

    @Get()
    async fetchAllCustomers(): Promise<Customer[]> {
        return this.customerService.fetchAllCustomers()
    }

    @Get(':id')
    async fetchCustomerById(@Param('id') id : number) : Promise <Customer> {
        return this.customerService.fetchCustomerById(id);
    }

    @Delete(':id')
    async deleteCustomerById(@Param('id') id : number) : Promise<Customer> {
        return this.customerService.deleteCustomerById(id);
    }
}
