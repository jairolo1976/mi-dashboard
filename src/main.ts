import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // ¡Importante: asegúrate de que 'express' esté instalado!

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  // Configuración para aumentar el límite del cuerpo de las peticiones (ej. para fotos grandes)
  // Estas líneas deben ir ANTES de la configuración CORS.
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Configuración CORS (Cross-Origin Resource Sharing)
  // Permite que tu frontend (en diferentes puertos) se comunique con este backend.
  app.enableCors({
    origin: [
      'http://localhost:5173', // Puerto común de desarrollo de frontend
      'http://localhost:5175', // Otro puerto común
      'http://localhost:5176', // ¡El puerto donde corre tu frontend actualmente!
      // Si en el futuro tu frontend corre en otros puertos o dominios, agrégalos aquí.
    ],
    credentials: true, // Permite el envío de cookies, encabezados de autorización, etc.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos HTTP permitidos
  });

  // Puerto en el que tu backend escuchará las peticiones
  // Según tu informe, la API corre en el puerto 3001.
  await app.listen(3001);
}

// Inicia la aplicación NestJS
bootstrap();