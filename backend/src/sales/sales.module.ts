import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';
import { Sale } from '../entities/sale.entity.js';
import { SaleItem } from '../entities/sale-item.entity.js';
import { Product } from '../entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, Product])],
  controllers: [SalesController],
  providers: [SalesService]
})
export class SalesModule {}

