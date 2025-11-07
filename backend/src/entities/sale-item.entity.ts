import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity.js';
import { Sale } from './sale.entity.js';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale!: any;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  unit_price!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal!: string;
}
