# MARKETIT 사전과제 
### 주문 관리 API (주문 접수처리, 주문 완료처리, 단일 주문조회, 주문 목록조회)

## 시작 가이드
```bash
// nest가 설치 되어 있지 않다면 설치해 주세요
npm i -g @nestjs/cli
npm install
// 실행 하기
npm run start
// test
npm run test
```
실행전에 .env 파일을 만들고 DB 설정을 해주세요
> ex)
DB_USERNAME = DB 접속 아이디
DB_HOST = "127.0.0.1"
DB_SECRET = DB 접속 비밀번호
DB_NAME = DB 이름

```ts
//처음 DB를 생성하고 연결한 경우
//app.module.ts 에서 typeORM 설정 synchronize: true 으로 해주세요
TypeOrmModule.forRoot({
  ...
  autoLoadEntities: true,
})
```

실행 후 http://localhost:3000/api-doc 주소를 통해 api 명세서를 확인 가능합니다.
## 프로젝트 소개

### 기술 스택
> TypeScript, NestJS, MySQL, TypeORM, Swagger

RDBMS 선택 이유 : 주문 내역, 주문자, 상품의 관계를 정의 해서 안정적인 구조로 개발이 가능할 것 이라고 생각 했습니다.

### DB ERD
![](https://powerful-daegu.s3.ap-northeast-2.amazonaws.com/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-06-01+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+5.56.14.png)
## API 명세서
<div class="opblock-tag-section is-open"><h3 class="opblock-tag no-desc" id="operations-tag-주문_API" data-tag="주문 API" data-is-open="true"><a class="nostyle" href="#/주문%20API"><span>주문 API</span></a><small></small><button aria-expanded="true" class="expand-operation" title="Collapse operation"><svg class="arrow" width="20" height="20" aria-hidden="true" focusable="false"><use href="#large-arrow-up" xlink:href="#large-arrow-up"></use></svg></button></h3><div class="no-margin"> <div class="operation-tag-content"><span><div class="opblock opblock-post" id="operations-주문_API-OrdersController_takeAnOrder"><div class="opblock-summary opblock-summary-post"><button aria-label="post ​/orders" aria-expanded="false" class="opblock-summary-control"><span class="opblock-summary-method">POST</span><span class="opblock-summary-path" data-path="/orders"><a class="nostyle" href="#/주문%20API/OrdersController_takeAnOrder"><span>/orders</span></a></span><div class="opblock-summary-description">주문 하기</div><svg class="arrow" width="20" height="20" aria-hidden="true" focusable="false"><use href="#large-arrow-down" xlink:href="#large-arrow-down"></use></svg></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard"><svg width="15" height="16"><use href="#copy" xlink:href="#copy"></use></svg></div></div><noscript></noscript></div></span><span><div class="opblock opblock-get" id="operations-주문_API-OrdersController_getOrder"><div class="opblock-summary opblock-summary-get"><button aria-label="get ​/orders" aria-expanded="false" class="opblock-summary-control"><span class="opblock-summary-method">GET</span><span class="opblock-summary-path" data-path="/orders"><a class="nostyle" href="#/주문%20API/OrdersController_getOrder"><span>/orders</span></a></span><div class="opblock-summary-description">주문 조회 하기</div><svg class="arrow" width="20" height="20" aria-hidden="true" focusable="false"><use href="#large-arrow-down" xlink:href="#large-arrow-down"></use></svg></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard"><svg width="15" height="16"><use href="#copy" xlink:href="#copy"></use></svg></div></div><noscript></noscript></div></span><span><div class="opblock opblock-post" id="operations-주문_API-OrdersController_permitOrder"><div class="opblock-summary opblock-summary-post"><button aria-label="post ​/orders​/permit" aria-expanded="false" class="opblock-summary-control"><span class="opblock-summary-method">POST</span><span class="opblock-summary-path" data-path="/orders/permit"><a class="nostyle" href="#/주문%20API/OrdersController_permitOrder"><span>/orders<wbr>/permit</span></a></span><div class="opblock-summary-description">주문 수락 하기</div><svg class="arrow" width="20" height="20" aria-hidden="true" focusable="false"><use href="#large-arrow-down" xlink:href="#large-arrow-down"></use></svg></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard"><svg width="15" height="16"><use href="#copy" xlink:href="#copy"></use></svg></div></div><noscript></noscript></div></span><span><div class="opblock opblock-get" id="operations-주문_API-OrdersController_getAllOrder"><div class="opblock-summary opblock-summary-get"><button aria-label="get ​/orders​/all" aria-expanded="false" class="opblock-summary-control"><span class="opblock-summary-method">GET</span><span class="opblock-summary-path" data-path="/orders/all"><a class="nostyle" href="#/주문%20API/OrdersController_getAllOrder"><span>/orders<wbr>/all</span></a></span><div class="opblock-summary-description">모든 주문 조회 하기</div><svg class="arrow" width="20" height="20" aria-hidden="true" focusable="false"><use href="#large-arrow-down" xlink:href="#large-arrow-down"></use></svg></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard"><svg width="15" height="16"><use href="#copy" xlink:href="#copy"></use></svg></div></div><noscript></noscript></div></span></div> </div></div>
## 기능 소개
### 주문 접수처리
상품에는 재고라는 개념이 있고, 한번에 여러 상품에 대한 주문이 가능하다는 로직으로 코딩을 했기 때문에 하나의 상품이라도 주문에 실패하면 트랜젝션을 이용하여 전체 실패를 하게 만들었다.

```ts
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
    const order = await this.ordersRepository.createOrder(queryRunner.manager, dto.user_id);
    await Promise.all(dto.products.map(async product => {   
        ...
        await this.ordersRepository.takeAnOrder(queryRunner.manager, order, findProduct, product.count);
    }));
} catch (error) {            
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    throw new BadRequestException(error.response.message);
}
await queryRunner.commitTransaction();
await queryRunner.release();
```
### 주문 완료처리
일반 사용자고 주문을 하고, 관리자가 주문 내역을 확인하고 수락을 한다. 그래서 유저 권한 체크와 수락을 할 때 예외상황을 막고자 예외처리에 고민을 했다.
```ts
if(!user) throw new UnauthorizedException('존재하지 않는 유저 입니다.');
if(!user.isAdmin) throw new UnauthorizedException('일반 유저는 주문을 수락 할 수 없습니다.');

// 주문 유효성 검사
const order = await this.ordersRepository.getOrderDetail(dto.order_id);
if(!order) throw new BadRequestException('주문이 존재하지 않습니다.');
if(order.permit) throw new BadRequestException('이미 수락된 주문 입니다.');
// 주문 이후 상품이 삭제됐을 경우
if(!order.order_product.product) throw new BadRequestException('주문 내역중 삭제된 상품이 있습니다.');
```

### 단일 주문조회
관리자 권한을 가졌거나 자기가 주문한 목록만을 보여 주기 위해 예외처리를 해주었다.

```ts
// 주문 자와 관리자만 볼 수 있다
if(user.id !== order.user.id && !user.isAdmin) throw new UnauthorizedException('권한이 없습니다.');
```


### 주문 목록조회
관리자는 현재 등록된 모든 주문목록을 일반 사용자는 자신이 주문한 목록만 볼 수 있게 분기 처리 하였다.

```ts
// 권한이 관리자인 경우 모든 주문 목록을 가져온다
if(user.isAdmin) {
    const orders = await this.ordersRepository.getAdminOrder();
    return orders;
// 권한이 일반 유저인 경우 자신의 모든 주문 목록을 가져온다
}else {
    const orders = await this.ordersRepository.getAllOrder(dto.user_id);
    return orders;
}
```
## 배운 점 & 아쉬운 점
테스트 코드를 작성하기 위해 repository 패턴을 선택하여 DB관련 로직과 service 로직을 분리하였다. 그러자 문제가 된것이 트렌젝션을 적용한 주문 접수 부분 로직이었다. 서비스 로직에서 트렌젝션을 적용하고자 하니 테스트 코드에서 dataSource 의존성 주입이 문제가 생기고 repository에서 트렌젝션을 적용하고자 하니 서비스 처리 로직이 repository로 넘어가는 문제가 있었다.

결국 인터넷 검색을 통해 dataSource를 모킹하는 방법을 찾아 적용을 해서 해결하였다. 이 과정을 통해 jest에 대한 공부와 디자인 패턴에 대한 공부가 필요하다고 느꼈다.


## 라이센스

MIT &copy; [modesty0310](mailto:segyeom.dev@gmail.com)
