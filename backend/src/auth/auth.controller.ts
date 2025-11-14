import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private jwt: JwtService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.auth.login(body.username, body.password);
  }

  @Get('me')
  me(@Req() req: any) {
    const authHeader: string | undefined = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) return { user: null };
    try {
      const token = authHeader.slice(7);
      const payload: any = this.jwt.verify(token);
      return this.auth.me(payload.sub);
    } catch {
      return { user: null };
    }
  }
}

