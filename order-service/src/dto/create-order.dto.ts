import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsInt()
    productId: number;

    @IsInt()
    price: number;

    @IsInt()
    quantity: number;
}

export class CreateOrderDto {
    @IsInt()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
    @IsString()
    city: string;

}