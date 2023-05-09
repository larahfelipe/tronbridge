import { config } from 'dotenv';

config();

export const envs = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 4000,
  loggerEnabled: process.env.LOGGER_ENABLED === 'true' || false
} as const;
