/*---------------------------------------------------------------*\
 * taskRoutes.js
 * 
 * Rutas para manejar las operaciones CRUD de las tareas.
 * 
 * Funcionalidad:
 * - Ruta para crear una nueva tarea.
 * - Ruta para obtener todas las tareas de un tablero específico.
 * - Ruta para obtener una tarea específica por su ID.
 * - Ruta para actualizar una tarea específica por su ID.
 * - Ruta para eliminar una tarea específica por su ID.
 * 
 * Controladores:
 * - `createTask`: Controlador que maneja la creación de una nueva tarea.
 * - `getTasksByBoard`: Controlador que obtiene todas las tareas asociadas a un tablero específico.
 * - `getTaskById`: Controlador que obtiene una tarea específica por su ID.
 * - `updateTask`: Controlador que actualiza los datos de una tarea específica por su ID.
 * - `deleteTask`: Controlador que elimina una tarea específica por su ID.
 * 
 *---------------------------------------------------------------*/

import express from "express";
import {
    createTask,
    getTasksByBoard,
    getTaskById,
    updateTask,
    deleteTask
} from "../controllers/taskController.js";  // Importar los controladores necesarios

const router = express.Router();

// Ruta para crear una nueva tarea
router.post("/create", createTask);

// Ruta para obtener todas las tareas de un tablero específico usando su ID
router.get("/board/:boardId", getTasksByBoard);

// Ruta para obtener una tarea específica utilizando su ID
router.get("/:id", getTaskById);

// Ruta para actualizar los datos de una tarea específica por su ID
router.put("/:id", updateTask);

// Ruta para eliminar una tarea específica por su ID
router.delete("/:id", deleteTask);

export default router;
