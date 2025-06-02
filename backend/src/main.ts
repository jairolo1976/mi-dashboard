// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'; // <--- ¡ESTA LÍNEA DEBE ESTAR!

async function bootstrap() {
  // Crear la aplicación de NestJS
  const app = await NestFactory.create(AppModule);

  // Configuración CORS
  app.enableCors({
    origin: [
      'http://localhost:5175',
      'http://localhost:5173',
      'http://localhost:5176',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5176'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // <--- ¡ESTAS DOS LÍNEAS SON LAS QUE FALTABAN O ESTABAN MAL! --->
  // APLICAR LOS LÍMITES DE TAMAÑO DEL CUERPO DE LA PETICIÓN USANDO EXPRESS
  app.use(express.json({ limit: '50mb' })); // Para JSON (la mayoría de las peticiones)
  app.use(express.urlencoded({ limit: '50mb', extended: true })); // Para formularios URL-encoded

  // Prefijo global para API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend ejecutándose en: http://localhost:${port}`);
  console.log(`📡 API disponible en: http://localhost:${port}/api`);
}

bootstrap();