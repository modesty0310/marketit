import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Order } from "src/orders/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends CommonEntity {
    @ApiProperty({
        description: '사용자 아이디',
        type: Number,
        example: 1
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        description: '사용자 이름',
        type: String,
        example: '홍길동'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Column()
    name: string;

    @OneToMany(() => Order, (order) => order.user)
    order: Order
}