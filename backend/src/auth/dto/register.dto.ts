import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  numeroIdentificacion: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroTelefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string;
}
