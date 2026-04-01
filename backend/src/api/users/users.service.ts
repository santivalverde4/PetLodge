import { Injectable } from '@nestjs/common';
import { User } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

type UserResponse = Omit<User, 'password' | 'fechaRegistro'> & { fechaRegistro: string };

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getProfile(user: User): UserResponse {
    return this.toResponse(user);
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserResponse> {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return this.toResponse(updated);
  }

  async deactivate(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  private toResponse(user: User): UserResponse {
    const { password: _password, fechaRegistro, ...rest } = user;
    return { ...rest, fechaRegistro: fechaRegistro.toISOString() };
  }
}
