import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Size } from './size.entity.js';
import { Color } from './color.entity.js';
import { User } from './user.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sku!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @ManyToOne(() => Size, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'size_id' })
  size?: Size | null;

  @ManyToOne(() => Color, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'color_id' })
  color?: Color | null;

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
}
