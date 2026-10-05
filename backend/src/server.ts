import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './services/enquiry.service';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 DroneTV Backend Server is running!`);
  logger.info(`📡 Port: ${config.port}`);
  logger.info(`🌐 Environment: ${config.nodeEnv}`);
  logger.info(`🔗 API Base: http://localhost:${config.port}/api`);
  logger.info(`🏥 Health Check: http://localhost:${config.port}/api/health`);
  logger.info(`📋 Enquiries API: http://localhost:${config.port}/api/enquiries`);
  logger.info(`=======================================================`);
});

// Graceful Shutdown Handling
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected.');
    } catch (err) {
      logger.error('Error disconnecting Prisma client:', err);
    }
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
