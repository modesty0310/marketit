import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { type } from "os";
import { CommonEntity } from "src/common/entities/common.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
        type: User
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
    permit: boolean;
}