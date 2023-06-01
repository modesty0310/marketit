import { Body, Controller, Get, NotAcceptableException, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FailResponseMessageDto } from 'src/common/dto/failResponseMessage.dto';
import { SuccessReponseMessageDto } from 'src/common/dto/successReponseMessage.dto';
import { PermitOrderDto } from './dto/completeOrder.dto';
import { GetAllOrderDto } from './dto/getAllOrder.dto';
import { GetOrderDto } from './dto/getOrder.dto';
import { TakeAnOrderDto } from './dto/takeAnOrder.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('주문 API')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ){}

    @Post()
    @ApiOperation({ summary: '주문 하기'})
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    @ApiResponse({status: 400, description:"실패", type: FailResponseMessageDto})
    async takeAnOrder(
        @Body() dto: TakeAnOrderDto
    ) {
        await this.ordersService.takeAnOrder(dto);
        return {message: '성공'};
    }

    @Post('permit')
    @ApiOperation({ summary: '주문 수락 하기'})
    @ApiResponse({status: 200, description:"성공", type: SuccessReponseMessageDto})
    @ApiResponse({status: 400, description:"실패", type: FailResponseMessageDto})
    async permitOrder(
        @Body() dto: PermitOrderDto
    ) {
        const result = await this.ordersService.permitOrder(dto);
        if(result.affected === 1) return {message: '성공'};
        throw new NotAcceptableException('주문을 수락하는데 실패 했습니다.');
    }

    @Get() 
    async getOrder(
        @Query() dto: GetOrderDto
    ): Promise<Order> {
        return await this.ordersService.getOrder(dto);
    }

    @Get('all') 
    async getAllOrder(
        @Query() dto: GetAllOrderDto
    ): Promise<Order[]> {
        return await this.ordersService.getAllOrder(dto);
    }
}
