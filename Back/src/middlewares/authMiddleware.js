/*---------------------------------------------------------------*\
 * authMiddleware.js
 * 
 * Middleware de autenticación para verificar que el usuario esté
 * autenticado antes de acceder a las rutas protegidas.
 * 
 * Funcionalidad:
 * - Verifica la presencia de un token JWT en el encabezado de la solicitud.
 * - Si el token es válido, se decodifica y se verifica que el usuario exista en la base de datos.
 * - Si el token no es válido o el usuario no se encuentra, se deniega el acceso con un código de estado 401.
 * 
 * Hooks y Componentes:
 * - jwt: Paquete para verificar y decodificar el token JWT.
 * - User: Modelo de usuario de la base de datos para comprobar la existencia del usuario.
 * 
 *---------------------------------------------------------------*/

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from '../utils/logger.js';

// Middleware de autentificación que verifica la validez del token JWT
const authMiddleware = async (req, res, next) => {
    // Obtener el token de los encabezados de la solicitud
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Si no hay token, denegar acceso
    if (!token) return res.status(401).json({ message: "Acceso denegado" });

    try {
        // Verificar y decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos usando el ID decodificado
        const user = await User.findById(decoded.id).select("-password");

        // Si el usuario no existe, denegar acceso
        if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

        // Asignar el usuario al objeto de solicitud para ser utilizado por el siguiente middleware/controlador
        req.user = user;

        // Continuar con la ejecución del siguiente middleware o controlador
        next();
    } catch (error) {
        // Si el token es inválido o hay un error durante la verificación
        logger.error("El token es inválido:", { error });
        res.status(401).json({ message: "Token inválido" });
    }
};

export default authMiddleware;
