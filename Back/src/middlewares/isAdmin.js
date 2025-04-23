/*---------------------------------------------------------------*\
 * isAdmin.js
 * 
 * Middleware que verifica si el usuario tiene el rol de administrador.
 * Si el usuario no es un administrador, se deniega el acceso y se 
 * responde con un mensaje de error y el código de estado 403.
 * 
 * Funcionalidad:
 * - Verifica el rol del usuario autenticado (req.user).
 * - Si el rol del usuario no es "admin", se deniega el acceso con un 
 *   mensaje de error 403.
 * - Si el usuario tiene el rol de "admin", permite continuar con la 
 *   ejecución del siguiente middleware o ruta.
 * 
 * Hooks y Componentes:
 * - `req.user`: El usuario autenticado que contiene información sobre el rol.
 * - `res.status(403)`: Código de estado HTTP que indica que el acceso está prohibido.
 *
 *---------------------------------------------------------------*/

export const isAdmin = (req, res, next) => {
  // Verificamos si el usuario tiene el rol de 'admin'
  if (req.user?.role !== 'admin') {
    // Si no es admin, retornamos un error 403 (Acceso denegado)
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
  }
  
  // Si es admin, permitimos que pase al siguiente middleware o ruta
  next();
};
