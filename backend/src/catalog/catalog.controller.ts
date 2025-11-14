import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from '../entities/size.entity.js';
import { Color } from '../entities/color.entity.js';
import { CreateSizeDto } from './dto/create-size.dto.js';
import { UpdateSizeDto } from './dto/update-size.dto.js';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';

@Controller()
export class CatalogController {
  constructor(
    @InjectRepository(Size) private sizesRepo: Repository<Size>,
    @InjectRepository(Color) private colorsRepo: Repository<Color>
  ) {}

  @Get('sizes')
  listSizes() {
    return this.sizesRepo.find({ order: { name: 'ASC' } });
  }

  // Sizes CRUD
  @Get('sizes/:id')
  async getSize(@Param('id', ParseIntPipe) id: number) {
    const s = await this.sizesRepo.findOne({ where: { id } });
    if (!s) throw new BadRequestException('Size not found');
    return s;
  }

  @Post('sizes')
  async createSize(@Body() dto: CreateSizeDto) {
    const s = this.sizesRepo.create(dto);
    try {
      return await this.sizesRepo.save(s);
    } catch (e: any) {
      throw new BadRequestException('Could not create size (maybe duplicate name)');
    }
  }

  @Put('sizes/:id')
  async updateSize(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSizeDto) {
    const s = await this.sizesRepo.findOne({ where: { id } });
    if (!s) throw new BadRequestException('Size not found');
    Object.assign(s, dto);
    try {
      return await this.sizesRepo.save(s);
    } catch (e: any) {
      throw new BadRequestException('Could not update size (maybe duplicate name)');
    }
  }

  @Delete('sizes/:id')
  async deleteSize(@Param('id', ParseIntPipe) id: number) {
    await this.sizesRepo.delete(id);
    return { success: true };
  }

  // Colors CRUD
  @Get('colors')
  listColors() {
    return this.colorsRepo.find({ order: { name: 'ASC' } });
  }

  @Get('colors/:id')
  async getColor(@Param('id', ParseIntPipe) id: number) {
    const c = await this.colorsRepo.findOne({ where: { id } });
    if (!c) throw new BadRequestException('Color not found');
    return c;
  }

  @Post('colors')
  async createColor(@Body() dto: CreateColorDto) {
    const c = this.colorsRepo.create(dto);
    try {
      return await this.colorsRepo.save(c);
    } catch (e: any) {
      throw new BadRequestException('Could not create color (maybe duplicate name)');
    }
  }

  @Put('colors/:id')
  async updateColor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto) {
    const c = await this.colorsRepo.findOne({ where: { id } });
    if (!c) throw new BadRequestException('Color not found');
    Object.assign(c, dto);
    try {
      return await this.colorsRepo.save(c);
    } catch (e: any) {
      throw new BadRequestException('Could not update color (maybe duplicate name)');
    }
  }

  @Delete('colors/:id')
  async deleteColor(@Param('id', ParseIntPipe) id: number) {
    await this.colorsRepo.delete(id);
    return { success: true };
  }
}
