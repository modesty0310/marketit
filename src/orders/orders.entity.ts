import { ApiProperty } from "@nestjs/swagger";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./orderProduct.entity";

@Entity('orders')
export class Order extends CommonEntity {
    @ApiProperty({
        description: '주문 번호',
        type: Number,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        description: '주문한 유저 정보',
        type: () => User
    })
    @ManyToOne(() => User, (user) => user.order, {nullable: false})
    @JoinColumn({name: 'user_id'})
    user: User

    @ApiProperty({
        description: '주문 수락 여부',
        type: Boolean,
        example: false,
        default: false
    })
    @Column({nullable: false, default:false})
    permit: boolean;

    @ApiProperty({
        description: '주문 정보',
        type: () => OrderProduct
    })
    @OneToMany(() => OrderProduct, (order_product) => order_product.order)
    order_product: OrderProduct
}