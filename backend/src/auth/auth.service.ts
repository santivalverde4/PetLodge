import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { auth } from './auth.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { numeroIdentificacion: dto.numeroIdentificacion },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Email or ID number already registered');
    }

    let authResponse: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
    try {
      authResponse = await auth.api.signUpEmail({
        body: { name: dto.nombre, email: dto.email, password: dto.password },
      });
    } catch {
      throw new InternalServerErrorException('Auth provider registration failed');
    }

    if (!authResponse?.user?.id) {
      throw new ConflictException('Email already registered in auth provider');
    }

    const avatarBase = this.config.get<string>('AVATAR_API', '');
    const defaultAvatar = avatarBase
      ? `${avatarBase}${encodeURIComponent(dto.nombre)}&backgroundColor=ffdfbf`
      : null;

    const user = await this.prisma.user.create({
      data: {
        id: authResponse.user.id,
        nombre: dto.nombre,
        numeroIdentificacion: dto.numeroIdentificacion,
        email: dto.email,
        numeroTelefono: dto.numeroTelefono,
        direccion: dto.direccion,
        foto: defaultAvatar,
      },
    });

    return {
      user: this.toResponse(user),
      access_token: authResponse.token,
    };
  }

  async login(dto: LoginDto) {
    let authResponse: Awaited<ReturnType<typeof auth.api.signInEmail>>;
    try {
      authResponse = await auth.api.signInEmail({
        body: { email: dto.email, password: dto.password },
      });
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!authResponse?.token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: authResponse.user.id },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or inactive');
    }

    return {
      user: this.toResponse(user),
      access_token: authResponse.token,
    };
  }

  private toResponse(user: User) {
    return {
      id: user.id,
      nombre: user.nombre,
      numeroIdentificacion: user.numeroIdentificacion,
      email: user.email,
      numeroTelefono: user.numeroTelefono,
      direccion: user.direccion,
      foto: user.foto,
      isActive: user.isActive,
      fechaRegistro: user.fechaRegistro.toISOString(),
    };
  }
}
