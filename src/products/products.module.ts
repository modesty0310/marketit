import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { ProductsRepository } from './products.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductsRepository],
    exports: [ProductsRepository]
})
export class ProductsModule {}
