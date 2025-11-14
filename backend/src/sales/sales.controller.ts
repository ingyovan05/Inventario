import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Query } from '@nestjs/common';
import { SalesService } from './sales.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    const uid = userId ? Number(userId) : undefined;
    return this.salesService.findAll(uid);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto, @Req() req: any) {
    const uid = req?.headers?.authorization?.startsWith('Bearer ') ? (require('jsonwebtoken').verify(req.headers.authorization.slice(7), process.env.JWT_SECRET || 'dev-secret') as any).sub : undefined;
    return this.salesService.create(dto, uid);
  }
}
