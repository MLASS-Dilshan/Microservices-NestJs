import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer/entity/customer.entity';

@Module({
  imports: [CustomerModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'sachira12345',
    database: 'spencer',
    entities: [Customer],
    synchronize: true,
  })],
})
export class AppModule { }
