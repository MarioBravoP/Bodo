/*---------------------------------------------------------------*\
 * userController.js
 * 
 * Controlador para manejar las operaciones relacionadas con los usuarios:
 * - Obtener el perfil de un usuario
 * - Actualizar el perfil de un usuario
 * - Enviar, aceptar y rechazar solicitudes de amistad
 * - Obtener contactos de un usuario
 * - Obtener todos los usuarios (solo admin)
 * - Eliminar un usuario (solo admin)
 * 
 * Dependencias:
 * - User: Modelo para los usuarios.
 * - Board: Modelo para los tableros de los usuarios.
 * - Task: Modelo para las tareas asociadas a los tableros.
 * - cloudinaryService: Servicio para manejar imágenes en la nube.
 * 
 * Reglas de acceso:
 * - Solo el usuario autenticado puede ver su propio perfil, y solo los administradores pueden obtener todos los usuarios o eliminar uno.
\*---------------------------------------------------------------*/

import User from "../models/User.js";
import Board from "../models/Board.js";
import Task from "../models/Task.js";
import { uploadProfileImage, deleteProfileImage } from '../services/cloudinaryService.js';
import mongoose from 'mongoose';
import logger from "../utils/logger.js";

// Función para obtener el perfil del usuario sin la contraseña
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate('contacts', 'name email profileImage')
            .populate('pendingRequests.user', 'email');

        res.json(user);
    } catch (error) {
        logger.error("Error al obtener el perfil:", error);
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

// Función para actualizar los datos del perfil de un usuario
export const updateUser = async (req, res) => {
    try {
        const { name, profileImage } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (name) user.name = name;

        if (profileImage) {
            if (user.profileImagePublicId) {
                await deleteProfileImage(user.profileImagePublicId);
            }
            const uploadResult = await uploadProfileImage(profileImage);
            user.profileImage = uploadResult.secureUrl;
            user.profileImagePublicId = uploadResult.publicId;
        }

        await user.save();

        res.json({
            message: "Perfil actualizado correctamente",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        logger.error("Error al actualizar el perfil:", error);
        res.status(500).json({ message: "Error al actualizar el perfil" });
    }
};

// Función para enviar una solicitud de amistad a otro usuario
export const sendFriendRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const senderId = req.user._id;
        const userEmail = req.user.email;

        if (email === userEmail) {
            return res.status(400).json({ message: "No puedes enviarte una solicitud a ti mismo" });
        }

        const recipient = await User.findOne({ email });
        if (!recipient) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (recipient.contacts.includes(senderId)) {
            return res.status(400).json({ message: "Ya son contactos" });
        }

        if (recipient.pendingRequests.some(req => req.user.toString() === senderId.toString() && req.status === 'pending')) {
            return res.status(400).json({ message: "Solicitud pendiente" });
        }

        recipient.pendingRequests.push({ user: senderId });
        await recipient.save();

        res.status(200).json({ message: "Solicitud de amistad enviada" });
    } catch (error) {
        logger.error("Error al enviar solicitud:", error);
        res.status(500).json({ message: "Error al enviar solicitud" });
    }
};

// Función para aceptar una solicitud de amistad (con transacción)
export const acceptFriendRequest = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).session(session);
        const request = user.pendingRequests.id(requestId);

        if (!request) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        request.status = 'accepted';
        user.contacts.push(request.user);

        const recipient = await User.findById(request.user).session(session);
        recipient.contacts.push(userId);

        user.pendingRequests.pull(requestId);

        await user.save({ session });
        await recipient.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Solicitud aceptada correctamente",
            newContact: {
                _id: recipient._id,
                name: recipient.name,
                email: recipient.email,
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al aceptar solicitud:", error);
        res.status(500).json({ message: "Error al aceptar solicitud" });
    }
};

// Función para rechazar una solicitud de amistad
export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const request = user.pendingRequests.id(requestId);

        if (!request) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        request.status = 'rejected';
        user.pendingRequests.pull(requestId);

        await user.save();

        res.status(200).json({ message: "Solicitud rechazada y eliminada correctamente" });
    } catch (error) {
        logger.error("Error al rechazar solicitud:", error);
        res.status(500).json({ message: "Error al rechazar solicitud" });
    }
};

// Función para obtener los contactos del usuario
export const getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('contacts')
            .populate('contacts', 'name email');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user.contacts);
    } catch (error) {
        logger.error("Error al obtener los contactos:", error);
        res.status(500).json({ message: 'Error al obtener los contactos' });
    }
};

// Función para obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        logger.error("Error al obtener los usuarios:", error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

// Función para eliminar un usuario (solo admin, con transacción)
export const deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.profileImagePublicId) {
            await deleteProfileImage(user.profileImagePublicId);
        }

        const boards = await Board.find({ owner: user._id }).session(session);
        for (const board of boards) {
            await Task.deleteMany({ board: board._id }).session(session);
            await board.deleteOne({ session });
        }

        await Board.updateMany(
            { members: user._id },
            { $pull: { members: user._id } },
            { session }
        );

        await User.updateMany(
            { contacts: user._id },
            { $pull: { contacts: user._id } },
            { session }
        );

        await User.updateMany(
            { 'pendingRequests.user': user._id },
            { $pull: { pendingRequests: { user: user._id } } },
            { session }
        );

        await user.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Usuario, tableros y tareas eliminados correctamente' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
