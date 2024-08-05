import { Prisma, PrismaClient } from '@prisma/client';
declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
    ],
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
      ],
    });
  }
  prisma = global.prisma;
}

export default prisma;