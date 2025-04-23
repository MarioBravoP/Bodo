/*---------------------------------------------------------------*\
 * authConfig.js
 * 
 * Configuración de autenticación para la aplicación.
 * 
 * Funcionalidad principal:
 * - Establece las variables de entorno necesarias para la autenticación.
 * - Define un valor por defecto en caso de que no estén configuradas.
 * 
 * Variables:
 * - `JWT_SECRET`: La clave secreta utilizada para firmar los tokens JWT.
 *   Toma el valor de la variable de entorno `JWT_SECRET`, o usa "secret" por defecto.
 * - `JWT_EXPIRE`: El tiempo de expiración del token JWT. 
 *   Toma el valor de la variable de entorno `JWT_EXPIRE`, o usa "1h" por defecto.
 * 
\*---------------------------------------------------------------*/

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
