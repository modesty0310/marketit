import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CompleteOrderDto } from './dto/completeOrder.dto';
import { GetOrderDto } from './dto/getOrder.dto';
import { TakeAnOrderDto } from './dto/takeAnOrder.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ){}

    @Post()
    async takeAnOrder(
        @Body() dto: TakeAnOrderDto
    ) {
        await this.ordersService.takeAnOrder(dto);
    }

    @Post('complete')
    async completeOrder(
        @Body() dto: CompleteOrderDto
    ) {
        const result = await this.ordersService.completeOrder(dto);
        
    }

    @Get() 
    async getOrder(
        @Query() dto: GetOrderDto
    ) {
        console.log(dto);
        
    }
}
