import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { OrderProduct } from "src/orders/orderProduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends CommonEntity {
    @ApiProperty({
        description: '상품 번호',
        type: Number,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        description: '상품 이름',
        type: String,
        example: '청소기'
    })
    @IsString()
    @IsNotEmpty()
    @Column({nullable: false})
    name: string;

    @ApiProperty({
        description: '상품 설명',
        type: String,
        example: '초강력 진공 청소기 입니다.'
    })
    @IsString()
    @IsNotEmpty()
    @Column('text', {nullable: false})
    description: string;

    @ApiProperty({
        description: '상품 재고',
        type: Number,
        example: 3
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({nullable: false})
    stock: number;

    @ApiProperty({
        description: '상품 가격',
        type: Number,
        example: 3000
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({nullable: false})
    price: number;

    @OneToMany(() => OrderProduct, (order_product) => order_product.order)
    order_product: OrderProduct
}