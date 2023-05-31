import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // env 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // typeORM 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_SECRET,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      logging: process.env.NODE_ENV === 'development' ? true : false,
      legacySpatialSupport: false,
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
