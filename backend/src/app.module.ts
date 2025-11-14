import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';
import { SalesModule } from './sales/sales.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'inventory_db',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined as any,
      autoLoadEntities: true,
      synchronize: true
    }),
    ProductsModule,
    SalesModule,
    ReportsModule,
    CatalogModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
