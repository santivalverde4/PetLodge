import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL as string, {});
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  const rooms = Array.from({ length: 15 }, (_, i) => ({
    numero: `Habitación ${i + 1}`,
  }));

  for (const room of rooms) {
    const existing = await prisma.room.findUnique({
      where: { numero: room.numero },
      select: { id: true },
    });

    if (!existing) {
      await prisma.room.create({ data: room });
    }
  }
}

void main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
