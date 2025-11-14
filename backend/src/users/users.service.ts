import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { validatePassword } from './password-policy.js';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  findAll() {
    return this.usersRepo.find({ select: ['id', 'username', 'is_admin', 'active', 'login_attempts', 'created_at', 'updated_at'] });
  }

  async create(dto: { username: string; password: string; is_admin?: boolean; active?: boolean }) {
    const exists = await this.usersRepo.findOne({ where: { username: dto.username } });
    if (exists) throw new BadRequestException('Usuario ya existe');
    try { validatePassword(dto.password, dto.username); } catch (e: any) { throw new BadRequestException(e.message || 'Clave insegura'); }
    const u = this.usersRepo.create({ username: dto.username, is_admin: !!dto.is_admin, active: dto.active ?? true });
    await u.setPassword(dto.password);
    return this.usersRepo.save(u);
  }

  async update(id: number, dto: { password?: string; is_admin?: boolean; active?: boolean }) {
    const u = await this.usersRepo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    if (dto.password) {
      try { validatePassword(dto.password, u.username); } catch (e: any) { throw new BadRequestException(e.message || 'Clave insegura'); }
      await u.setPassword(dto.password);
    }
    if (dto.is_admin !== undefined) u.is_admin = !!dto.is_admin;
    if (dto.active !== undefined) u.active = !!dto.active;
    if (u.active) u.login_attempts = 0;
    return this.usersRepo.save(u);
  }

  async remove(id: number) {
    const u = await this.usersRepo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepo.delete(id);
    return { success: true };
  }
}
