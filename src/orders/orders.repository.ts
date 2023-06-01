import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/products/products.entity";
import { ProductsRepository } from "src/products/products.repository";
import { EntityManager, Repository} from "typeorm";
import { OrderProduct } from "./orderProduct.entity";
import { Order } from "./orders.entity";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
    ){}

    async createOrder(transactionManager: EntityManager, user_id: number) {
        const order = await transactionManager.save(Order, {user: {id: user_id}, permit: false});
        
        return order;
    }

    async takeAnOrder(transactionManager: EntityManager, order: Order, product: Product, count: number) {
        const updatedProduct = await transactionManager.save(Product, {...product, stock: product.stock - count});
        await transactionManager.save(OrderProduct, {order: {id: order.id}, product: {id: updatedProduct.id}, count});        
    }

    async getOrder(order_id: number) {
        const order = await this.orderRepository.findOne({where: {id: order_id}});

        return order;
    }

    async getOrderDetail(order_id: number) {
        const order = await this.orderProductRepository.createQueryBuilder('order_product')
        .leftJoinAndSelect('order_product.user', 'user')
        .leftJoinAndSelect('order_product.order', 'order')
        .where('order_product.order_id = :id', {id: order_id})
        .getOne();

        return order;
    }

    async permitOrder(order_id: number) {
        const order = await this.orderRepository.createQueryBuilder()
        .update()
        .set({
            permit: true
        })
        .where('id = :id', {id: order_id})
        .execute();

        return order
    }
}