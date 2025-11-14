import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from '../entities/size.entity.js';
import { Color } from '../entities/color.entity.js';
import { CreateSizeDto } from './dto/create-size.dto.js';
import { UpdateSizeDto } from './dto/update-size.dto.js';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class CatalogController {
  constructor(
    @InjectRepository(Size) private sizesRepo: Repository<Size>,
    @InjectRepository(Color) private colorsRepo: Repository<Color>,
    private jwt: JwtService
  ) {}

  private userIdFromReq(req: any): number | null {
    const h = req?.headers?.authorization as string | undefined;
    if (!h?.startsWith('Bearer ')) return null;
    try { const p: any = this.jwt.verify(h.slice(7)); return p?.sub ?? null; } catch { return null; }
  }

  @Get('sizes')
  listSizes() {
    return this.sizesRepo.find({ order: { name: 'ASC' }, relations: { created_by: true, updated_by: true } });
  }

  // Sizes CRUD
  @Get('sizes/:id')
  async getSize(@Param('id', ParseIntPipe) id: number) {
    const s = await this.sizesRepo.findOne({ where: { id } });
    if (!s) throw new BadRequestException('Size not found');
    return s;
  }

  @Post('sizes')
  async createSize(@Body() dto: CreateSizeDto, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    const s = this.sizesRepo.create({ ...dto, created_by: uid ? ({ id: uid } as any) : null, updated_by: uid ? ({ id: uid } as any) : null });
    try {
      return await this.sizesRepo.save(s);
    } catch (e: any) {
      throw new BadRequestException('Could not create size (maybe duplicate name)');
    }
  }

  @Put('sizes/:id')
  async updateSize(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSizeDto, @Req() req: any) {
    const s = await this.sizesRepo.findOne({ where: { id } });
    if (!s) throw new BadRequestException('Size not found');
    Object.assign(s, dto);
    const uid = this.userIdFromReq(req);
    if (uid) (s as any).updated_by = { id: uid } as any;
    try {
      return await this.sizesRepo.save(s);
    } catch (e: any) {
      throw new BadRequestException('Could not update size (maybe duplicate name)');
    }
  }

  @Delete('sizes/:id')
  async deleteSize(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const s = await this.sizesRepo.findOne({ where: { id } });
    if (!s) return { success: true };
    const uid = this.userIdFromReq(req);
    if (uid) (s as any).updated_by = { id: uid } as any;
    (s as any).active = false;
    await this.sizesRepo.save(s);
    return { success: true };
  }

  // Colors CRUD
  @Get('colors')
  listColors() {
    return this.colorsRepo.find({ order: { name: 'ASC' }, relations: { created_by: true, updated_by: true } });
  }

  @Get('colors/:id')
  async getColor(@Param('id', ParseIntPipe) id: number) {
    const c = await this.colorsRepo.findOne({ where: { id } });
    if (!c) throw new BadRequestException('Color not found');
    return c;
  }

  @Post('colors')
  async createColor(@Body() dto: CreateColorDto, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    const c = this.colorsRepo.create({ ...dto, created_by: uid ? ({ id: uid } as any) : null, updated_by: uid ? ({ id: uid } as any) : null });
    try {
      return await this.colorsRepo.save(c);
    } catch (e: any) {
      throw new BadRequestException('Could not create color (maybe duplicate name)');
    }
  }

  @Put('colors/:id')
  async updateColor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateColorDto, @Req() req: any) {
    const c = await this.colorsRepo.findOne({ where: { id } });
    if (!c) throw new BadRequestException('Color not found');
    Object.assign(c, dto);
    const uid = this.userIdFromReq(req);
    if (uid) (c as any).updated_by = { id: uid } as any;
    try {
      return await this.colorsRepo.save(c);
    } catch (e: any) {
      throw new BadRequestException('Could not update color (maybe duplicate name)');
    }
  }

  @Delete('colors/:id')
  async deleteColor(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const c = await this.colorsRepo.findOne({ where: { id } });
    if (!c) return { success: true };
    const uid = this.userIdFromReq(req);
    if (uid) (c as any).updated_by = { id: uid } as any;
    (c as any).active = false;
    await this.colorsRepo.save(c);
    return { success: true };
  }
}

