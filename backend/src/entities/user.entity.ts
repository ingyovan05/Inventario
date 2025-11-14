import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password_hash!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'boolean', default: false })
  is_admin!: boolean;

  @Column({ type: 'int', default: 0 })
  login_attempts!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  async setPassword(raw: string) {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(raw, salt);
  }

  async verifyPassword(raw: string) {
    return bcrypt.compare(raw, this.password_hash);
  }
}

