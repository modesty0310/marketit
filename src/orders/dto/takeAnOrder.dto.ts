import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from "class-validator";

class IProduct {
    @ApiProperty({
        description: '상품 번호',
        type: Number,
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: '상품 주문 개수',
        type: Number,
        example: 3
    })
    @IsNumber()
    @IsNotEmpty()
    count: number
}

export class TakeAnOrderDto {
    @ApiProperty({
        description: '유저 아이디',
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    user_id: number;

    @ApiProperty({
        type: IProduct,
        isArray: true
    })
    @IsNotEmpty()
    @IsNotEmptyObject()
    products: IProduct[]
}