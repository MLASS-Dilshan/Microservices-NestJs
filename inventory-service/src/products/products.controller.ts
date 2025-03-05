import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { query } from 'express';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Post()
    async createProduct(
        @Body() createProductDto: CreateProductDto
    ): Promise<Products> {
        return this.productService.createProducts(createProductDto);
    }

    @Get()
    async fetchAllProducts(): Promise<Products[]> {
        return this.productService.fetchAllProducts()
    }

    @Get(':id')
    async fetchProductsById(@Param('id') id: number): Promise<Products> {
        return this.productService.fetchProductsById(id);
    }

    @Delete(':id')
    async deleteProductById(@Param('id') id: number): Promise<Products> {
        return this.productService.deleteProductById(id)
    }

    // http://localhost:3001/products/1/validate?quantity=10
    @Get(':id/validate')
    async validateStock(@Param('id') id: number, @Query('quantity') quantity: number): Promise<{ available: boolean }> {
        return this.productService.validateStock(id, quantity)
    }

    // http://localhost:3001/products/1/quantity
    // request Body

    // {
    //     "quantity": 10000
    // }
    @Patch(':id/quantity')
    async reduceStock(@Param('id') id : number, @Body('quantity') quantity : number): Promise<Products>{
        return this.productService.reduceStock(id, quantity)
    }
}
