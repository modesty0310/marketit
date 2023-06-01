import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/products/products.entity';
import { ProductsRepository } from 'src/products/products.repository';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { DataSource, EntityManager } from "typeorm";
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/user.entity';
import { Order } from './orders.entity';

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

class ProductMockRepository {
  DB: Omit<Product, 'order_product' | 'createdAt' | 'updatedAt'>[] = [
    {id: 1, name: '선풍기', description: '시원한 선풍기', price: 13000, stock: 3},
    {id: 2, name: '선풍기2', description: '시원한 선풍기2', price: 13000, stock: 5}
  ]

  getProduct(product_id: number) {
    const product = this.DB.filter(el => el.id === product_id);

    if(product.length) return product[0]
    return null;
  }

}
class OrderMockRepository {
  DB = [
    {id: 1, permit: false, user: {id: 1, name: '홍길동', isAdmin: false}},
    {id: 2, permit: true, user: {id: 3, name: '외부인', isAdmin: false}},
  ]

  getOrder(order_id: number) {
    const order = this.DB.filter(el => el.id === order_id);

    if(order.length) return order[0];
    return null;
  }

  permitOrder(order_id: number) {
    const order = this.DB.filter(el => el.id === order_id);

    if(order.length) {
      order[0].permit = true;
      return order[0];
    }
    return null;
  }

  getOrderDetail(order_id: number) {
    const order = this.DB.filter(el => el.id === order_id);

    if(order.length) {
      const result = {...order[0], user: {id: 1, name: '홍길동', isAdmin: false}}
      return result;
    }
    return null;
  }

  createOrder(transactionManager: EntityManager, user_id: number) {
    const order = {id: 3, permit: false, user: {id: user_id, name: '홍길동', isAdmin: false}};
    this.DB.push(order);
    return order;
  }

  getAdminOrder() {
    return this.DB;
  }

  getAllOrder(user_id: number) {
    const orders = this.DB.filter(el => el.id === user_id);
    return orders;
  }
}

class UserMockRepository {
  DB: Omit<User, 'createdAt' | 'updatedAt' | 'order'>[]  = [
    {id: 1, name: '홍길동', isAdmin: false},
    {id: 2, name: '관리자', isAdmin: true},
    {id: 3, name: '외부인', isAdmin: false}
  ]

  getUser(user_id: number) {
    const user = this.DB.filter(el => el.id === user_id);
    
    if(user.length) return user[0];
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
          provide: ProductsRepository,
          useClass: ProductMockRepository
        },
        {
          provide: OrdersRepository,
          useClass: OrderMockRepository
        },
        {
          provide: UserRepository,
          useClass: UserMockRepository
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
    it('존재 하지 않는 유저가 요청할 떄', async () => {
      try {
        await service.takeAnOrder({user_id: 4, products: [{id:3, count: 10}]})
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    })

    it('요청 하는 사람이 관리자 일 때 실패', async () => {
      try {
        await service.takeAnOrder({user_id: 2, products: [{id:3, count: 10}]});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    })

    it('제대로된 상품을 요청했는지 확인', async () => {
      try {
        await service.takeAnOrder({user_id: 1, products: [{id:3, count: 10}]});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })

    it('상품 개수가 충분하지 않은경우', async () => {
      try {
        await service.takeAnOrder({user_id: 1, products: [{id:1, count: 10}]});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })
  })

  describe('주문 완료하기', () => {
    it('존재 하지 않는 유저의 요청일 때', async () => {
      try {
        await service.permitOrder({user_id: 4, order_id: 1});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    })

    it('일반 유저의 수락 요청일 때', async () => {
      try {
        await service.permitOrder({user_id: 1, order_id: 1});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    })

    it('존재 하지 않는 주문일 때', async () => {
      try {
        await service.permitOrder({user_id: 2, order_id: 3});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })

    it('이미 수락된 주문일 때', async () => {
      try {
        await service.permitOrder({user_id: 2, order_id: 2});
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    })

    it('성공적으로 수락한 경우', async () => {
      const result = await service.permitOrder({user_id: 2, order_id: 1});
      expect(result).toEqual({id: 1, permit: true, user: {id: 1, name: '홍길동', isAdmin: false}});
    })
  })

  describe('모든 주문 조회하기', () => {
    it('존재 하지 않는 유저', async () => {
      try {
        await service.getAllOrder({user_id: 4});
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    })

    it('관리 자일 경우 모든 주문 리턴', async () => {
      const result = await service.getAllOrder({user_id: 2});
      expect(result.length).toBe(2);
    })

    it('일반 사용자일 경우 자기 주문만 리턴', async () => {
      const result = await service.getAllOrder({user_id: 1});
      expect(result.length).toBe(1);
    })
  })
});
