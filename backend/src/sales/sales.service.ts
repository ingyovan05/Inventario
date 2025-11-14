import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity.js';
import { SaleItem } from '../entities/sale-item.entity.js';
import { Product } from '../entities/product.entity.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SalesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Sale) private salesRepo: Repository<Sale>,
    @InjectRepository(SaleItem) private itemsRepo: Repository<SaleItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>
  ) {}

  findAll(userId?: number) {
    const where = userId ? { created_by: { id: userId } } : {};
    return this.salesRepo.find({ where: where as any, relations: { items: { product: true }, created_by: true, updated_by: true } });
  }

  async findOne(id: number) {
    const sale = await this.salesRepo.findOne({ where: { id }, relations: { items: { product: true } } });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async create(dto: CreateSaleDto, userId?: number) {
    if (!dto.items?.length) throw new BadRequestException('Sale must have at least one item');

    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      let total = 0n;
      const items: SaleItem[] = [];

      for (const item of dto.items) {
        const product = await qr.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) throw new BadRequestException(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) throw new BadRequestException(`Insufficient stock for product ${product.name}`);

        product.stock -= item.quantity;
        await qr.manager.save(product);

        const unitPrice = BigInt(Math.round(parseFloat(item.unitPrice) * 100));
        const subtotal = unitPrice * BigInt(item.quantity);
        total += subtotal;

        const saleItem = qr.manager.create(SaleItem, {
          product,
          quantity: item.quantity,
          unit_price: (Number(unitPrice) / 100).toFixed(2),
          subtotal: (Number(subtotal) / 100).toFixed(2),
          created_by: userId ? ({ id: userId } as any) : null,
          updated_by: userId ? ({ id: userId } as any) : null
        });
        items.push(saleItem);
      }

      const sale = qr.manager.create(Sale, {
        date: dto.date ? new Date(dto.date) : new Date(),
        total: (Number(total) / 100).toFixed(2),
        payment_method: dto.payment_method,
        items,
        created_by: userId ? ({ id: userId } as any) : null,
        updated_by: userId ? ({ id: userId } as any) : null
      });
      const saved = await qr.manager.save(sale);
      await qr.commitTransaction();
      return saved;
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }
}
