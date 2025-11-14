import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll() {
    return this.repo.find({ where: {}, relations: { size: true, color: true } });
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: { size: true, color: true } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(dto: CreateProductDto) {
    const { sizeId, colorId, ...rest } = dto as any;
    const product = this.repo.create(rest);
    if (sizeId) (product as any).size = { id: sizeId } as any;
    if (colorId) (product as any).color = { id: colorId } as any;
    return this.repo.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    const { sizeId, colorId, ...rest } = dto as any;
    Object.assign(product, rest);
    if (sizeId !== undefined) (product as any).size = sizeId ? ({ id: sizeId } as any) : null;
    if (colorId !== undefined) (product as any).color = colorId ? ({ id: colorId } as any) : null;
    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    product.active = false;
    return this.repo.save(product);
  }

  async restock(id: number, quantity: number) {
    const product = await this.findOne(id);
    product.stock += quantity;
    return this.repo.save(product);
  }
}
