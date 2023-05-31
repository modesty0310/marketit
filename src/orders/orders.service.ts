import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from 'src/products/products.repository';
import { DataSource } from 'typeorm';
import { TakeAnOrderDto } from './dto/takeAnOrder.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly productsRepository: ProductsRepository,
        private readonly dataSource: DataSource
    ) {}

    async takeAnOrder(dto: TakeAnOrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect(); // 2
        await queryRunner.startTransaction(); // 3
        
        try {
            await Promise.all(dto.products.map(async product => {
                const findProduct = await this.productsRepository.getProduct(product.id);
                // 제대로된 상품을 요청했는지 확인
                if( !findProduct ) throw new BadRequestException('존재 하지 않는 상품입니다.');
                // 상품 개수가 충분한지 확인
                if( findProduct.stock < product.count ) throw new BadRequestException('상품의 제고가 부족합니다.');
                await this.ordersRepository.takeAnOrder(queryRunner.manager, dto.user_id, findProduct, product.count);
            }));
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release()
            throw new BadRequestException(error.message);
        }
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }
}
