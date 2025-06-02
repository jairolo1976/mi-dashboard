import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log('🚀 Backend ejecutándose en: http://localhost:3001');
  console.log('📡 API disponible en: http://localhost:3001/api');
}
bootstrap();
