import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(private readonly dataSource: DataSource) {}

  async summary(from?: string, to?: string, userId?: number) {
    const qb = this.dataSource.createQueryRunner();
    await qb.connect();
    try {
      const where: string[] = [];
      const params: any[] = [];
      if (from) {
        where.push('s.date >= $1');
        params.push(new Date(from));
      }
      if (to) {
        where.push(`s.date <= $${params.length + 1}`);
        params.push(new Date(to));
      }
      if (userId) {
        where.push(`s.created_by_id = $${params.length + 1}`);
        params.push(userId);
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const salesAgg = await qb.query(
        `SELECT COUNT(*)::int as sales_count, COALESCE(SUM(total),0)::numeric as total_sales FROM sales s ${whereSql}`,
        params
      );
      const inv = await qb.query(
        `SELECT COUNT(*)::int as products, COALESCE(SUM(stock),0)::int as units, COALESCE(SUM(stock*price),0)::numeric as stock_value FROM products WHERE active = true`
      );
      return { sales: salesAgg[0], inventory: inv[0] };
    } finally {
      await qb.release();
    }
  }

  async topProducts(limit = 10, from?: string, to?: string, userId?: number) {
    const qb = this.dataSource.createQueryRunner();
    await qb.connect();
    try {
      const where: string[] = [];
      const params: any[] = [];
      if (from) {
        where.push('s.date >= $1');
        params.push(new Date(from));
      }
      if (to) {
        where.push(`s.date <= $${params.length + 1}`);
        params.push(new Date(to));
      }
      if (userId) {
        where.push(`s.created_by_id = $${params.length + 1}`);
        params.push(userId);
      }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const res = await qb.query(
        `SELECT p.id, p.name, SUM(si.quantity)::int as qty
         FROM sale_items si
         JOIN products p ON p.id = si.product_id
         JOIN sales s ON s.id = si.sale_id
         ${whereSql}
         GROUP BY p.id, p.name
         ORDER BY qty DESC
         LIMIT $${params.length + 1}`,
        [...params, limit]
      );
      return res;
    } finally {
      await qb.release();
    }
  }
}
