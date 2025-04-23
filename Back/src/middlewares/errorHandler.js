/*---------------------------------------------------------------*\
 * errorHandler.js
 *
 * Middleware de manejo de errores. Captura y procesa los errores 
 * que ocurren en la aplicación. Dependiendo del tipo de error, 
 * se asigna un código de estado HTTP adecuado y se devuelve una 
 * respuesta JSON con el mensaje de error correspondiente.
 *
 * Funcionalidad:
 * - Captura y maneja errores comunes como:
 *   - Errores de validación (400).
 *   - Errores de token inválido o expirado (401).
 *   - Errores de duplicado en MongoDB (400).
 *   - Errores generales (500).
 * 
 * Hooks y Componentes:
 * - Respuesta con un `statusCode` y un `message` específicos según el tipo de error.
 *
 *---------------------------------------------------------------*/
import logger from '../utils/logger.js';

const errorHandler = (err, res) => {
  logger.error(`[ERROR] ${err.message}`, { stack: err.stack });

  // Desestructuración para obtener el código de estado y el mensaje por defecto
  let { statusCode = 500, message = "Error interno del servidor" } = err;

  // Manejo de errores comunes basado en el nombre del error
  switch (err.name) {
    case "ValidationError":
      statusCode = 400;
      message = "Error de validación en los datos";  // Error por datos no válidos
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Token inválido, no autorizado";  // Error de token inválido
      break;
    case "TokenExpiredError":
      statusCode = 401;
      message = "Token expirado, inicie sesión de nuevo";  // Error de token expirado
      break;
    default:
      // Error de duplicado en MongoDB, basado en el código de error
      if (err.code === 11000) {
        statusCode = 400;
        message = "El elemento ya existe en la base de datos";  // Error de duplicado en MongoDB
      }
      break;
  }

  // Responder con el código de estado y el mensaje correspondiente
  res.status(statusCode).json({
    success: false,
    message,
  });
};

/*---------------------------------------------------------------*\
 * notFoundHandler.js
 *
 * Middleware para manejar rutas no encontradas (404). Si el usuario 
 * accede a una ruta que no existe, se responde con un error 404 
 * y un mensaje indicando que la ruta no fue encontrada.
 *
 * Funcionalidad:
 * - Maneja las solicitudes a rutas que no existen.
 * - Retorna un mensaje informativo con el código de estado 404.
 *
 *---------------------------------------------------------------*/

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,  // Mensaje indicando la ruta no encontrada
  });
};

// Exportación de los middlewares
export { errorHandler, notFoundHandler };
