import { config } from 'dotenv';

config();

export const envs = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
  loggerEnabled: process.env.LOGGER_ENABLED === 'true' || false
} as const;
