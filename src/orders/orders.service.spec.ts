import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/products/products.entity';
import { ProductsRepository } from 'src/products/products.repository';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

import { DataSource } from "typeorm";

// @ts-ignore
export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  createQueryRunner: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      save: jest.fn(),
   }
  }))
}))

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};
class OrderMockRepository {

}

class ProductMockRepository {
  DB: Omit<Product, 'order_product' | 'createdAt' | 'updatedAt'>[] = [
    {id: 1, name: '선풍기', description: '시원한 선풍기', price: 13000, stock: 3},
    {id: 2, name: '선풍기2', description: '시원한 선풍기2', price: 13000, stock: 5}
  ]

  getProdut(id: number) {
    const product: Omit<Product, 'order_product' | 'createdAt' | 'updatedAt'>[] = this.DB.filter(el => el.id === id);

    if(product.length) return product[0]
    return null;
  }
}

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useClass: OrderMockRepository
        },
        {
          provide: ProductsRepository,
          useClass: ProductMockRepository
        },
        { 
          provide: DataSource, 
          useFactory: dataSourceMockFactory 
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('주문 접수하기', () => {
    it('제대로된 상품을 요청했는지 확인', async () => {
      try {
        service.takeAnOrder({user_id: 1, products: [{id:3, count: 10}]})
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })

    it('상품 개수가 충분하지 않은경우', async () => {
      try {
        service.takeAnOrder({user_id: 1, products: [{id:1, count: 10}]});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })


  })
});
