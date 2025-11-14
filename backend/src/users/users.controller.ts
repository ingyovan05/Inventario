import { Body, Controller, Get, Post, Put, Param, ParseIntPipe, Req, UnauthorizedException, ForbiddenException, Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtService } from '@nestjs/jwt';

function requireAdmin(req: any, jwt: JwtService) {
  const authHeader: string | undefined = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();
  const payload: any = jwt.verify(authHeader.slice(7));
  if (!payload?.is_admin) throw new ForbiddenException();
  return payload;
}

@Controller('users')
export class UsersController {
  constructor(private users: UsersService, private jwt: JwtService) {}

  @Get()
  list(@Req() req: any) {
    requireAdmin(req, this.jwt);
    return this.users.findAll();
  }

  @Post()
  create(@Req() req: any, @Body() body: { username: string; password: string; is_admin?: boolean; active?: boolean }) {
    requireAdmin(req, this.jwt);
    return this.users.create(body);
  }

  @Put(':id')
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { password?: string; is_admin?: boolean; active?: boolean }
  ) {
    requireAdmin(req, this.jwt);
    return this.users.update(id, body);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const payload = requireAdmin(req, this.jwt);
    // Opcional: impedir borrarse a sí mismo
    if (payload.sub === id) throw new ForbiddenException('No puede eliminar su propio usuario');
    return this.users.remove(id);
  }
}
