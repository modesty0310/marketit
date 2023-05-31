import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/products/products.entity";
import { ProductsRepository } from "src/products/products.repository";
import { EntityManager, Repository} from "typeorm";
import { IProduct } from "./dto/takeAnOrder.dto";
import { OrderProduct } from "./orderProduct.entity";
import { Order } from "./orders.entity";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
        private readonly productsRepository: ProductsRepository,
    ){}

    async takeAnOrder(transactionManager: EntityManager, user_id: number, product: Product, count: number) {
        const order = await transactionManager.save(Order, {user: {id: user_id}, permit: false});
        const updatedProduct = await transactionManager.save(Product, {...product, stock: product.stock - count});
        const orderProduct = await transactionManager.save(OrderProduct, {order: {id: order.id}, product: {id: updatedProduct.id}, count});
        console.log(order, updatedProduct, orderProduct);
        
    }
}