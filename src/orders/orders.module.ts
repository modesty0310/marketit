import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './orderProduct.entity';
import { Order } from './orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from 'src/products/products.module';
import { OrdersRepository } from './orders.repository';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderProduct]), ProductsModule, UserModule],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
