import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

declare global {
  var __db__: PrismaClient;
}

let db: PrismaClient;

if (process.env['NODE_ENV'] === 'production') {
  db = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  db = global.__db__;
}

// Handle connection events
db.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect();
  logger.info('Database disconnected');
});

export { db };