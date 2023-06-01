import { ApiProperty } from "@nestjs/swagger";

export class SuccessReponseMessageDto {

    @ApiProperty({
        description: '성공 메세지',
        type: String,
        example: '성공 메세지'
    })
    message: string
}