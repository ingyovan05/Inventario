import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SaleItem } from './sale-item.entity.js';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method?: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items!: SaleItem[];
}

