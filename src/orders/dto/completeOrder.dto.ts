import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PermitOrderDto {
    @ApiProperty({
        description: '유저 아이디',
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty({
        description: '주문 아이디',
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    order_id: number;
}