/*---------------------------------------------------------------*\
 * taskController.js
 * 
 * Controlador para manejar las operaciones relacionadas con las tareas:
 * - Crear una nueva tarea
 * - Obtener todas las tareas de un tablero
 * - Obtener una tarea por ID
 * - Actualizar una tarea existente
 * - Eliminar una tarea y sus comentarios
 * 
 * Funcionalidades principales:
 * - `createTask`: Crea una nueva tarea asociada a un tablero.
 * - `getTasksByBoard`: Obtiene todas las tareas asociadas a un tablero específico.
 * - `getTaskById`: Obtiene una tarea específica por su ID.
 * - `updateTask`: Actualiza una tarea existente.
 * - `deleteTask`: Elimina una tarea específica.
 * 
 * Dependencias:
 * - `Task`: Modelo para las tareas.
 * - `Board`: Modelo para los tableros asociados a las tareas.
 * 
 * Reglas de acceso:
 * - El autor de la tarea es el único autorizado para eliminarla.
 * 
\*---------------------------------------------------------------*/

import mongoose from "mongoose";
import Task from "../models/Task.js";
import Board from "../models/Board.js";
import logger from "../utils/logger.js";

// Función para crear una tarea nueva
export const createTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { title, description, status, board, dueDate } = req.body;

        // Verificar si el tablero existe
        const boardExists = await Board.findById(board).session(session);
        if (!boardExists) {
            await session.abortTransaction();
            return res.status(404).json({ message: "El tablero no existe" });
        }

        // El autor de la tarea es el usuario autenticado
        const author = req.user._id;

        // Crear una nueva instancia de Task con los datos proporcionados
        const task = new Task({
            title,
            description,
            status,
            author,
            board,
            dueDate,
        });

        // Guardar la tarea en la base de datos
        await task.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Responder con la tarea recién creada
        res.status(201).json({ message: "Tarea creada correctamente", task });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al crear la tabla:", error);
        res.status(500).json({ message: "Error al crear la tarea" });
    }
};

// Función para obtener todas las tareas de un tablero específico
export const getTasksByBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId;

        // Verificar si el tablero existe
        const boardExists = await Board.findById(boardId);
        if (!boardExists) {
            return res.status(404).json({ message: "El tablero no existe" });
        }

        // Obtener todas las tareas asociadas al tablero
        const tasks = await Task.find({ board: boardId });
        res.json(tasks);
    } catch (error) {
        logger.error("Error al obtener las tareas:", error);
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
};

// Función para obtener una tarea por su ID
export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;

        // Buscar la tarea por su ID y poblar los detalles del autor
        const task = await Task.findById(taskId)
            .populate("author", "name email");

        // Verificar si la tarea existe
        if (!task) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Responder con la tarea encontrada
        res.json(task);
    } catch (error) {
        logger.error("Error al obtener la tarea:", error);
        res.status(500).json({ message: "Error al obtener la tarea" });
    }
};

// Función para actualizar una tarea existente
export const updateTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const taskId = req.params.id;
        const { title, description, status, dueDate, priority } = req.body;

        // Buscar la tarea por su ID
        const task = await Task.findById(taskId).session(session);
        if (!task) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Actualizar los valores de la tarea si se proporcionan
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;

        // Guardar los cambios en la base de datos
        await task.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.json({ message: "Tarea actualizada correctamente", task });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al actualizar la tarea:", error);
        res.status(500).json({ message: "Error al actualizar la tarea" });
    }
};

// Función para eliminar una tarea y sus comentarios
export const deleteTask = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const taskId = req.params.id;

        // Buscar la tarea por su ID
        const task = await Task.findById(taskId).session(session);
        if (!task) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        // Verificar si el usuario es el autor de la tarea
        if (task.author.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(403).json({ message: "No tienes permiso para eliminar esta tarea" });
        }

        // Eliminar la tarea de la base de datos
        await task.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();
        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al eliminar la tarea:", error);
        res.status(500).json({ message: "Error al eliminar la tarea" });
    }
};
