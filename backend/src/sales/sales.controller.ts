import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SalesService } from './sales.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService, private jwt: JwtService) {}

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
    const uid = this.userIdFromReq(req);
    return this.salesService.create(dto, uid);
  }
}
