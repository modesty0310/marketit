import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/products/products.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./orders.entity";

@Entity('order_product')
export class OrderProduct extends CommonEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        type: () => Order
    })
    @ManyToOne(() => Order, (order) => order.order_product, {nullable: false})
    @JoinColumn({name: 'order_id'})
    order: Order;

    @ApiProperty({
        type: () => Product
    })
    @ManyToOne(() => Product, (product) => product.order_product, {nullable: false})
    @JoinColumn({name: 'product_id'})
    product: Product;

    @ApiProperty({
        description: '주문 개수',
        type: Number,
        example: 3
    })
    @IsNotEmpty()
    @IsNumber()
    @Column({nullable: false})
    count: number;
}