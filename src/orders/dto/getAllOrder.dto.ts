import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class GetAllOrderDto {
    @ApiProperty({
        description: '유저 아이디',
        type: Number,
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    user_id: number;
}