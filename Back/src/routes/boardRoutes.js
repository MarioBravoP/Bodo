/*---------------------------------------------------------------*\
 * boardRoutes.js
 * 
 * Rutas para manejar las operaciones CRUD de los tableros.
 * 
 * Funcionalidad:
 * - Ruta para crear un nuevo tablero.
 * - Ruta para obtener todos los tableros de un usuario.
 * - Ruta para obtener un tablero por su ID.
 * - Ruta para actualizar un tablero por su ID.
 * - Ruta para eliminar un tablero por su ID.
 * 
 * Controladores:
 * - `createBoard`: Controlador que maneja la creación de un nuevo tablero.
 * - `getBoardsByUser`: Controlador que obtiene todos los tableros de un usuario específico.
 * - `getBoardById`: Controlador que obtiene un tablero específico por su ID.
 * - `updateBoard`: Controlador que actualiza los datos de un tablero específico por su ID.
 * - `deleteBoard`: Controlador que elimina un tablero específico por su ID.
 * 
 *---------------------------------------------------------------*/

import express from "express";
import { 
    createBoard, 
    updateBoard, 
    deleteBoard, 
    getBoardsByUser, 
    getBoardById 
} from "../controllers/BoardController.js";  // Importar los controladores necesarios

const router = express.Router();

// Ruta para crear un nuevo tablero
router.post("/create", createBoard);

// Ruta para obtener todos los tableros de un usuario autenticado
router.get("/", getBoardsByUser);

// Ruta para obtener un tablero específico por su ID
router.get("/:id", getBoardById);

// Ruta para actualizar un tablero específico por su ID
router.put("/:id", updateBoard);

// Ruta para eliminar un tablero específico por su ID
router.delete("/:id", deleteBoard);

export default router;
