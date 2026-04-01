import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El nombre no es válido' })
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\+?[\d\s\-()]{7,20}$/, {
    message: 'El número de teléfono no es válido',
  })
  numeroTelefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'La dirección no es válida' })
  direccion?: string;
}
