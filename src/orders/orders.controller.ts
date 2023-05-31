import { Body, Controller, Post } from '@nestjs/common';
import { CompleteOrderDto } from './dto/completeOrder.dto';
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
}
