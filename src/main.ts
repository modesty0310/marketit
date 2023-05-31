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
    .setTitle('대구 아동 급식카드 앱')
    .setDescription('대구 아동 급식카드 API문서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
