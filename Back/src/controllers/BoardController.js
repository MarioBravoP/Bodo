/*---------------------------------------------------------------*\
 * boardController.js
 * 
 * Controlador para manejar las operaciones relacionadas con los tableros:
 * - Crear un nuevo tablero
 * - Obtener los tableros a los que el usuario pertenece
 * - Obtener un tablero por ID
 * - Actualizar un tablero
 * - Eliminar un tablero y sus tareas asociadas
 * 
 * Funcionalidades principales:
 * - `createBoard`: Crea un nuevo tablero, asignando al propietario y a los miembros.
 * - `getBoardsByUser`: Obtiene los tableros donde el usuario es miembro.
 * - `getBoardById`: Obtiene un tablero específico por ID, incluyendo miembros y tareas asociadas.
 * - `updateBoard`: Permite que solo el propietario actualice la información del tablero.
 * - `deleteBoard`: Elimina un tablero y sus tareas asociadas. Solo el propietario puede eliminarlo.
 * 
 * Dependencias:
 * - `Board`: Modelo para los tableros de trabajo.
 * - `Task`: Modelo para las tareas asociadas a los tableros.
 * 
 * Reglas de acceso:
 * - Solo el propietario del tablero puede editarlo o eliminarlo.
 * - Los usuarios deben ser miembros del tablero para poder acceder a él.
\*---------------------------------------------------------------*/

import mongoose from "mongoose";
import Board from "../models/Board.js";
import Task from "../models/Task.js";
import logger from "../utils/logger.js";

// Función para crear un tablero nuevo
export const createBoard = async (req, res) => {
    const session = await mongoose.startSession(); // Iniciamos una sesión de MongoDB
    session.startTransaction(); // Empezamos una transacción

    try {
        const { title, description, members = [] } = req.body;

        const owner = req.user._id;

        // Crear una nueva instancia de Board con los datos proporcionados
        const board = new Board({
            title,
            description,
            owner,
            members: [...members, owner],
        });

        // Guardar el tablero en la base de datos usando la sesión
        await board.save({ session });

        // Confirmamos la transacción
        await session.commitTransaction();
        session.endSession(); // Cerramos la sesión

        // Responder con el tablero recién creado
        res.status(201).json({ message: "Tablero creado correctamente", board });
    } catch (error) {
        await session.abortTransaction(); // Cancelamos la transacción si hay error
        session.endSession(); // Cerramos la sesión
        logger.error("Error al crear el tablero:", error);
        res.status(500).json({ message: "Error al crear el tablero" });
    }
};

// Obtener los tableros donde el usuario es miembro
export const getBoardsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Buscar los tableros donde el usuario es miembro
        const boards = await Board.find({ members: userId })
            .populate('owner', 'name')
            .lean();

        // Contar las tareas asociadas a cada tablero
        const boardsWithTasksCount = await Promise.all(
            boards.map(async (board) => {
                const taskCount = await Task.countDocuments({ board: board._id });
                return {
                    ...board,
                    taskCount,
                };
            })
        );

        // Responder con los tableros y el número de tareas asociadas a cada uno
        res.json(boardsWithTasksCount);
    } catch (error) {
        logger.error("Error al obtener tableros:", error);
        res.status(500).json({ message: "Error al obtener tableros" });
    }
};

// Obtener un tablero por su ID
export const getBoardById = async (req, res) => {
    try {
        // Buscar el tablero por su ID y poblar los detalles de 'owner' y 'members'
        const board = await Board.findById(req.params.id)
            .populate('owner', 'name email profileImage')
            .populate('members', 'name email profileImage');

        if (!board) return res.status(404).json({ message: "Tablero no encontrado" });

        // Verificar si el usuario tiene acceso al tablero
        if (!board.members.some(member => member._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: "Acceso denegado" });
        }

        // Filtrar miembros para eliminar al propietario
        const filteredMembers = board.members.filter(
            member => member._id.toString() !== board.owner._id.toString()
        );

        // Obtener las tareas asociadas al tablero
        const tasks = await Task.find({ board: board._id });

        // Responder con el tablero, los miembros filtrados y las tareas
        res.json({
            board: {
                ...board.toObject(),
                members: filteredMembers
            },
            tasks
        });
    } catch (error) {
        logger.error("Error al obtener el tablero:", error);
        res.status(500).json({ message: "Error al obtener el tablero" });
    }
};

// Función para actualizar un tablero (solo puede hacerlo el propietario)
export const updateBoard = async (req, res) => {
    const session = await mongoose.startSession(); // Iniciamos una sesión
    session.startTransaction(); // Empezamos una transacción

    try {
        const board = await Board.findById(req.params.id).session(session);

        if (!board) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Tablero no encontrado" });
        }

        if (board.owner.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Solo el creador puede editar este tablero" });
        }

        const { title, description, members } = req.body;

        // Actualizar los campos si se proporcionan
        if (title) board.title = title;
        if (description) board.description = description;
        if (members) board.members = [...new Set([...members, board.owner])];

        // Guardar cambios dentro de la sesión
        await board.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Tablero actualizado", board });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al actualizar el tablero:", error);
        res.status(500).json({ message: "Error al actualizar el tablero" });
    }
};

// Función para eliminar un tablero y sus tareas asociadas (solo el propietario)
export const deleteBoard = async (req, res) => {
    const session = await mongoose.startSession(); // Iniciamos una sesión
    session.startTransaction(); // Empezamos una transacción

    try {
        const boardId = req.params.id;

        const board = await Board.findById(boardId).session(session);

        if (!board) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Tablero no encontrado" });
        }

        if (board.owner.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Solo el creador puede eliminar este tablero" });
        }

        // Eliminar las tareas asociadas dentro de la transacción
        await Task.deleteMany({ board: boardId }).session(session);

        // Eliminar el tablero
        await Board.findByIdAndDelete(boardId).session(session);

        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Tablero y sus tareas eliminados correctamente" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al eliminar el tablero:", error);
        res.status(500).json({ message: "Error al eliminar el tablero" });
    }
};
