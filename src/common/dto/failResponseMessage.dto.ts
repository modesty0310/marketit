import { ApiProperty } from "@nestjs/swagger"

export class FailResponseMessageDto {
    @ApiProperty({
        description: 'stats_code',
        type: Number,
        example: 400
    })
    statusCode: number

    @ApiProperty({
        description: '에러 발생 시간',
        type: String,
        example: "2023-03-17T07:09:13.346Z"
    })
    timestamp: string

    @ApiProperty({
        description: 'url',
        type: String,
        example: "/orders"
    })
    path: string

    @ApiProperty({
        description: '에러 메세지',
        type: String,
        example: "에러 메세지"
    })
    error: string
}