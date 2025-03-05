import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products/entity/product.entity';

@Module({
  imports: [ProductsModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.HOSTNAME || 'localhost',
    port: 3306,
    username: 'root',
    password: 'sachira12345',
    database: 'spencer',
    entities: [Products],
    synchronize: true, //only on dev
  })],
})
export class AppModule { }
