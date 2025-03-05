import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';

@Module({
  providers: [CustomerService],
  controllers: [CustomerController],
  imports: [TypeOrmModule.forFeature([Customer])]
})
export class CustomerModule {}
