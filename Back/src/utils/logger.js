/*---------------------------------------------------------------*\
 * logger.js
 *
 * Configuración de Winston para entornos serverless (Vercel).
 * Solo se usa la consola como salida de logs.
 *
\*---------------------------------------------------------------*/

import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level}: ${stack || message}`;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});

export default logger;
