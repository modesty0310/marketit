import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ProductsRepository } from 'src/products/products.repository';
import { UserRepository } from 'src/user/user.repository';
import { DataSource } from 'typeorm';
import { PermitOrderDto } from './dto/completeOrder.dto';
import { GetAllOrderDto } from './dto/getAllOrder.dto';
import { GetOrderDto } from './dto/getOrder.dto';
import { TakeAnOrderDto } from './dto/takeAnOrder.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly userRepository: UserRepository,
        private readonly dataSource: DataSource
    ) {}

    async takeAnOrder(dto: TakeAnOrderDto) {
        // 유저 유효성 검사
        const user = await this.userRepository.getUser(dto.user_id);
        if(!user) throw new UnauthorizedException('존재하지 않는 유저 입니다.');
        if(user.isAdmin) throw new UnauthorizedException('관리자는 주문을 할 수 없습니다.');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect(); // 2
        await queryRunner.startTransaction(); // 3
        
        try {
            const order = await this.ordersRepository.createOrder(queryRunner.manager, dto.user_id);
            await Promise.all(dto.products.map(async product => {                
                const findProduct = await this.productsRepository.getProduct(product.id);
                // 제대로된 상품을 요청했는지 확인
                if( !findProduct ) throw new BadRequestException('존재 하지 않는 상품입니다.');
                // 상품 개수가 충분한지 확인
                if( findProduct.stock < product.count ) throw new BadRequestException('상품의 제고가 부족합니다.');
                await this.ordersRepository.takeAnOrder(queryRunner.manager, order, findProduct, product.count);
            }));
        } catch (error) {            
            await queryRunner.rollbackTransaction();
            await queryRunner.release()
            throw new BadRequestException(error.response.message);
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    async permitOrder(dto: PermitOrderDto) {
        // 유저 유효성 검사
        const user = await this.userRepository.getUser(dto.user_id);
        if(!user) throw new UnauthorizedException('존재하지 않는 유저 입니다.');
        if(!user.isAdmin) throw new UnauthorizedException('일반 유저는 주문을 수락 할 수 없습니다.');

        // 주문 유효성 검사
        const order = await this.ordersRepository.getOrderDetail(dto.order_id);
        if(!order) throw new BadRequestException('주문이 존재하지 않습니다.');
        if(order.permit) throw new BadRequestException('이미 수락된 주문 입니다.');

        // 주문 이 후 상품이 삭제됐을 경우

        const updatedOrder = await this.ordersRepository.permitOrder(dto.order_id);
        return updatedOrder;
    }

    async getOrder(dto: GetOrderDto) {
        const user = await this.userRepository.getUser(dto.user_id);
        const order = await this.ordersRepository.getOrderDetail(dto.order_id);
        
        if(!user) throw new UnauthorizedException('존재하지 않는 유저 입니다.');
        if(!order) throw new BadRequestException('주문이 존재하지 않습니다.');
        // 주문 자와 관리자만 볼 수 있다
        if(user.id !== order.user.id && !user.isAdmin) throw new UnauthorizedException('권한이 없습니다.');

        return order;
    }

    async getAllOrder(dto: GetAllOrderDto) {
        const user = await this.userRepository.getUser(dto.user_id);

        if(!user) throw new UnauthorizedException('존재하지 않는 유저 입니다.');
        
        // 권한이 관리자인 경우 모든 주문 목록을 가져온다
        if(user.isAdmin) {
            const orders = await this.ordersRepository.getAdminOrder();
            return orders;
        // 권한이 일반 유저인 경우 자신의 모든 주문 목록을 가져온다
        }else {
            const orders = await this.ordersRepository.getAllOrder(dto.user_id);
            return orders;
        }
    }
}
