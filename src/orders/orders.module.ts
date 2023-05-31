import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './orderProduct.entity';
import { Order } from './orders.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderProduct])]
})
export class OrdersModule {}
