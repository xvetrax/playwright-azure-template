import { Logger } from '@helper/logger/Logger';

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    Logger.debug(message, context);
  },
  info(message: string, context?: Record<string, unknown>): void {
    Logger.info(message, context);
  },
  warn(message: string, context?: Record<string, unknown>): void {
    Logger.warn(message, context);
  },
  error(message: string, context?: Record<string, unknown>): void {
    Logger.error(message, context);
  },
};

export { Logger };
