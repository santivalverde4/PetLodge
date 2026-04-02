//Script that seeds the database with initial data for rooms. 
//It creates 10 standard rooms and 5 special rooms, all marked as available.
//The script uses the Prisma Client to perform upsert operations, ensuring 
//that if a room with the same number already exists, it will be updated 
//instead of creating a duplicate entry.
import 'dotenv/config';
import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the Prisma seed script.');
}

const prisma = new PrismaClient({
  adapter: new PrismaNeonHttp(databaseUrl, {}),
} as ConstructorParameters<typeof PrismaClient>[0]);

const standardRooms = Array.from({ length: 10 }, (_, index) => ({
  numero: `${101 + index}`,
  tipo: 'estandar',
  isAvailable: true,
}));

const specialRooms = Array.from({ length: 5 }, (_, index) => ({
  numero: `${201 + index}`,
  tipo: 'especial',
  isAvailable: true,
}));

const rooms = [...standardRooms, ...specialRooms];

async function main(): Promise<void> {
  await Promise.all(
    rooms.map((room) =>
      prisma.room.upsert({
        where: { numero: room.numero },
        update: {
          tipo: room.tipo,
          isAvailable: room.isAvailable,
        },
        create: room,
      }),
    ),
  );

  console.log(`Seeded ${rooms.length} rooms.`);
}

main()
  .catch((error: unknown) => {
    console.error('Failed to seed rooms.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
