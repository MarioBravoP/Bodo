/*---------------------------------------------------------------*\
 * userRoutes.js
 * 
 * Rutas para manejar las operaciones relacionadas con los usuarios.
 * 
 * Funcionalidad:
 * - Ruta para obtener el perfil del usuario autenticado.
 * - Ruta para actualizar los datos del usuario autenticado.
 * - Ruta para buscar usuarios por correo electrónico.
 * - Rutas para gestionar solicitudes de amistad (enviar, aceptar, rechazar).
 * - Ruta para obtener los contactos del usuario.
 * - Rutas de administración para obtener todos los usuarios y eliminar usuarios.
 * 
 * Controladores:
 * - `getUserProfile`: Controlador que obtiene el perfil del usuario autenticado.
 * - `updateUser`: Controlador que actualiza los datos del usuario autenticado.
 * - `findUsersByEmail`: Controlador que permite buscar usuarios por su correo electrónico.
 * - `sendFriendRequest`: Controlador que envía una solicitud de amistad a otro usuario.
 * - `acceptFriendRequest`: Controlador que acepta una solicitud de amistad.
 * - `rejectFriendRequest`: Controlador que rechaza una solicitud de amistad.
 * - `getContacts`: Controlador que obtiene los contactos del usuario.
 * - `getAllUsers`: Controlador que obtiene todos los usuarios (solo accesible para administradores).
 * - `deleteUser`: Controlador que elimina un usuario (solo accesible para administradores).
 * 
 * Middlewares:
 * - `isAdmin`: Middleware que verifica si el usuario tiene rol de administrador antes de acceder a ciertas rutas.
 * 
 *---------------------------------------------------------------*/

import express from "express";
import { 
    getUserProfile, 
    updateUser, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    getContacts, 
    getAllUsers, 
    deleteUser 
} from "../controllers/userController.js";

import { findUsersByEmail } from "../controllers/authController.js";
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Ruta para obtener el perfil del usuario autenticado
router.get("/profile", getUserProfile);

// Ruta para actualizar los datos del usuario autenticado
router.put("/update", updateUser);

// Ruta para buscar usuarios por correo electrónico
router.post("/find-by-email", findUsersByEmail);

// Rutas para gestionar solicitudes de amistad
router.post('/send-friend-request', sendFriendRequest);  // Enviar solicitud de amistad
router.post('/accept-friend-request', acceptFriendRequest);  // Aceptar solicitud de amistad
router.post('/reject-friend-request', rejectFriendRequest);  // Rechazar solicitud de amistad

// Ruta para obtener los contactos del usuario
router.get('/contacts', getContacts);

// Rutas de administración, solo accesibles por administradores
router.get('/admin', isAdmin, getAllUsers);  // Obtener todos los usuarios (solo admin)
router.delete('/admin/:userId', isAdmin, deleteUser);  // Eliminar usuario por ID (solo admin)

export default router;
