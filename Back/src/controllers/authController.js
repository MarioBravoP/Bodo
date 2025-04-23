/*---------------------------------------------------------------*\
 * authController.js
 * 
 * Controlador para manejar la autenticación de usuarios:
 * - Registro de usuarios con transacciones
 * - Inicio de sesión con autenticación basada en JWT
 * - Cierre de sesión
 * - Verificación del usuario autenticado
 * - Búsqueda de usuarios por correo electrónico
 * 
 * Funcionalidades principales:
 * - `register`: Crea un nuevo usuario y almacena sus datos en la base de datos.
 * - `login`: Autentica al usuario y devuelve un token JWT para la sesión.
 * - `logout`: Función para cerrar sesión. No se requiere acción en el servidor, el logout se maneja en el frontend.
 * - `verify`: Verifica si el usuario está autenticado usando el JWT.
 * - `findUsersByEmail`: Verifica si un listado de correos electrónicos existe en la base de datos.
 * 
 * Dependencias:
 * - `User`: Modelo de usuario para la base de datos.
 * - `jwt`: Librería para crear y verificar tokens JWT.
 * - `bcrypt`: Librería para encriptar y comparar contraseñas.
 * 
 * Variables de entorno:
 * - `JWT_SECRET`: Se utiliza para firmar el token JWT.
 * 
\*---------------------------------------------------------------*/

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Función para crear un usuario nuevo
export const register = async (req, res) => {
    const session = await mongoose.startSession(); // Iniciamos una sesión de MongoDB
    session.startTransaction(); // Empezamos una transacción

    try {
        const { name, email, password } = req.body;

        // Buscamos si ya existe un usuario con el mismo email, usando la sesión
        const userExists = await User.findOne({ email }).session(session);

        if (userExists) {
            // Si el usuario ya existe, cancelamos la transacción
            await session.abortTransaction();
            session.endSession(); // Cerramos la sesión
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Creamos un nuevo usuario
        const user = new User({ name, email, password });

        // Guardamos el usuario dentro de la transacción
        await user.save({ session });

        // Confirmamos la transacción
        await session.commitTransaction();
        session.endSession(); // Cerramos la sesión

        // Respondemos con éxito
        res.status(201).json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        // Si ocurre algún error, cancelamos la transacción
        await session.abortTransaction();
        session.endSession(); // Cerramos la sesión
        logger.error("Error al registrar:", error);
        res.status(500).json({ message: "Error al registrar" });
    }
};

// Función para logearse en la app, crea un token utilizando JWT
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos por correo electrónico
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        // Crear un token JWT con el ID del usuario y la clave secreta
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

        // Responder con el token JWT
        res.json({ token });
    } catch (error) {
        // Manejar errores durante el login
        logger.error("Error en el login:", error);
        res.status(500).json({ message: "Error en el login" });
    }
};

// Función para deslogear, ya que no almacenamos nada en el servidor, el logout es gestionado en el frontend
export const logout = async (req, res) => {
    try {
        // Responder con un mensaje de éxito para cerrar sesión
        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        // Manejar errores durante el logout
        logger.error("Error en el logout:", error);
        res.status(500).json({ message: "Error en el logout" });
    }
}

// Función para verificar el usuario (basado en JWT)
export const verify = async (req, res) => {
    try {
        // Responder con los datos del usuario autenticado
        res.json({ user: req.user });
    } catch (error) {
        // Manejar errores durante la verificación del usuario
        logger.error("Error al verificar usuario:", error);
        res.status(500).json({ message: "Error al verificar usuario" });
    }
};

// Función para comprobar que los correos electrónicos estén registrados en la base de datos
export const findUsersByEmail = async (req, res) => {
    const { emails } = req.body;

    // Verificar que el parámetro `emails` sea un array
    if (!Array.isArray(emails)) {
        return res.status(400).json({ message: 'Se espera un array de emails' });
    }

    try {
        // Buscar usuarios que tengan el correo electrónico en la lista proporcionada
        const users = await User.find({ email: { $in: emails } }).select('_id email');

        // Obtener los correos encontrados y comparar con los que no se encontraron
        const foundEmails = users.map(u => u.email);
        const notFound = emails.filter(email => !foundEmails.includes(email));

        // Si algunos correos no se encuentran, devolver un error
        if (notFound.length > 0) {
            return res.status(404).json({ message: 'Algunos correos no existen en la base de datos', notFound });
        }

        // Responder con los usuarios encontrados
        res.json(users);
    } catch (err) {
        // Manejar errores durante la búsqueda de usuarios
        logger.error("Error al buscar usuarios:", error);
        res.status(500).json({ message: 'Error al buscar usuarios' });
    }
};
