import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type RoomResponse = {
  id: string;
  name: string;
};

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<RoomResponse[]> {
    const rooms = await this.prisma.room.findMany({
      orderBy: { numero: 'asc' },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: `Habitación ${room.numero}`,
    }));
  }

  async findAvailable(from: string, to: string): Promise<RoomResponse[]> {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('Las fechas from y to deben ser válidas');
    }

    if (fromDate >= toDate) {
      throw new BadRequestException('La fecha from debe ser menor que to');
    }

    const rooms = await this.prisma.room.findMany({
      where: {
        reservations: {
          none: {
            estado: { in: ['CONFIRMADA', 'EN_PROGRESO'] },
            fechaEntrada: { lt: toDate },
            fechaSalida: { gt: fromDate },
          },
        },
      },
      orderBy: { numero: 'asc' },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: `Habitación ${room.numero}`,
    }));
  }
}
