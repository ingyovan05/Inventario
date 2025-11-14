import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { RestockDto } from './dto/restock.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private jwt: JwtService) {}

  private userIdFromReq(req: any): number | undefined {
    const h: string | undefined = req?.headers?.authorization;
    if (!h?.startsWith('Bearer ')) return undefined;
    try {
      const p: any = this.jwt.verify(h.slice(7));
      return p?.sub;
    } catch {
      return undefined;
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    return this.productsService.create(dto, uid);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    return this.productsService.update(id, dto, uid);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    return this.productsService.remove(id, uid);
  }

  @Post(':id/restock')
  restock(@Param('id', ParseIntPipe) id: number, @Body() dto: RestockDto, @Req() req: any) {
    const uid = this.userIdFromReq(req);
    return this.productsService.restock(id, dto.quantity, uid);
  }
}
