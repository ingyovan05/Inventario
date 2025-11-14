import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from '../entities/size.entity.js';
import { Color } from '../entities/color.entity.js';
import { CatalogController } from './catalog.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Size, Color])],
  controllers: [CatalogController]
})
export class CatalogModule {}

