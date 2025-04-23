/*---------------------------------------------------------------*\
 * authRoutes.js
 * 
 * Rutas para la autenticación del usuario: registro, login y verificación.
 * 
 * Funcionalidad:
 * - Ruta para registrar un nuevo usuario.
 * - Ruta para hacer login de un usuario ya registrado.
 * - Ruta para verificar el token del usuario autenticado y obtener su información.
 * 
 * Controladores y Middlewares:
 * - `register`: Controlador que maneja el registro de un nuevo usuario.
 * - `login`: Controlador que maneja el login de un usuario existente.
 * - `authMiddleware`: Middleware que verifica si el usuario está autenticado a través del token JWT.
 * 
 *---------------------------------------------------------------*/

import express from "express";
import { register, login } from "../controllers/authController.js";  // Importar controladores para el registro y login
import authMiddleware from "../middlewares/authMiddleware.js";  // Importar middleware de autenticación

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para hacer login de un usuario existente
router.post("/login", login);

// Ruta para verificar el token de un usuario autenticado
// Usa el middleware de autenticación para verificar el token
router.get("/verify", authMiddleware, (req, res) => {
    // Responde con los datos del usuario autenticado
    res.json({ user: req.user });
});

export default router;
