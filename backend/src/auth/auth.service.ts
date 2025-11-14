import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService
  ) {}

  async ensureAdminSeed() {
    const exists = await this.usersRepo.findOne({ where: { username: 'admin' } });
    if (!exists) {
      const u = this.usersRepo.create({ username: 'admin', is_admin: true, active: true, login_attempts: 0 });
      await u.setPassword('@InvAdmin2025');
      await this.usersRepo.save(u);
    }
  }

  async login(username: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.active) throw new ForbiddenException('Usuario bloqueado/inactivo');

    const ok = await user.verifyPassword(password);
    if (!ok) {
      user.login_attempts += 1;
      if (user.login_attempts >= 3) {
        user.active = false;
      }
      await this.usersRepo.save(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    user.login_attempts = 0;
    await this.usersRepo.save(user);
    const payload = { sub: user.id, username: user.username, is_admin: user.is_admin };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: { id: user.id, username: user.username, is_admin: user.is_admin } };
  }

  async me(userId: number) {
    const u = await this.usersRepo.findOne({ where: { id: userId } });
    if (!u) throw new UnauthorizedException();
    return { id: u.id, username: u.username, is_admin: u.is_admin, active: u.active };
  }
}

