import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { AuditService } from './audit/audit.service.js';
import dotenv from 'dotenv';
import { AuthService } from './auth/auth.service.js';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      skipMissingProperties: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  // Seed admin user if missing
  await app.get(AuthService).ensureAdminSeed();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://${host}:${port}`);
}

bootstrap();
