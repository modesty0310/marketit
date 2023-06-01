import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./products.entity";

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ){}

    async getProduct(id: number) {       
        const product = await this.productsRepository.createQueryBuilder()
        .select()
        .where('id =:id', {id})
        .getOne();

        return product
    }
}