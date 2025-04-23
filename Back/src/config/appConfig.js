/*---------------------------------------------------------------*\
 * config.js
 * 
 * Configuración general de la aplicación.
 * 
 * Funcionalidad principal:
 * - Establece las variables de entorno para el puerto y la URL del frontend.
 * - Si no están definidas, se asignan valores por defecto.
 * 
 * Variables:
 * - `PORT`: El puerto en el que se ejecutará el servidor, utilizando el valor
 *   de la variable de entorno `PORT`, o 5000 por defecto.
 * - `FRONTEND_URL`: La URL del frontend, tomando el valor de la variable
 *   de entorno `FRONTEND_URL`, o "http://localhost:5173" por defecto.
 * 
\*---------------------------------------------------------------*/

export const PORT = process.env.PORT || 5000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
