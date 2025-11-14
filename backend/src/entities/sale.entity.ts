import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SaleItem } from './sale-item.entity.js';
import { User } from './user.entity.js';

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

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_id' })
  created_by?: User | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by?: User | null;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items!: SaleItem[];
}
