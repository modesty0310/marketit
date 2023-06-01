import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 예외 필터 추가
  app.useGlobalFilters(new HttpExceptionFilter());

  // 유효성 검사 파이프
  app.useGlobalPipes(new ValidationPipe());

  // swagger 추가
  const config = new DocumentBuilder()
    .setTitle('marketit 사전과제')
    .setDescription('marketit 사전과제')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(3000);
}
bootstrap();
