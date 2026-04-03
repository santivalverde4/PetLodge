import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class AvailableRoomsQueryDto {
  @ApiProperty({ example: '2026-04-15' })
  @IsDateString({}, { message: 'La fecha from debe ser una fecha válida (YYYY-MM-DD)' })
  from: string;

  @ApiProperty({ example: '2026-04-20' })
  @IsDateString({}, { message: 'La fecha to debe ser una fecha válida (YYYY-MM-DD)' })
  to: string;
}
