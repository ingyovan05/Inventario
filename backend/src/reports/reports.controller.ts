import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  summary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.summary(from, to);
    }

  @Get('top-products')
  topProducts(
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.reportsService.topProducts(limit ? parseInt(limit, 10) : 10, from, to);
  }
}

