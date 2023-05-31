import { Body, Controller, Post } from '@nestjs/common';
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

    }
}
