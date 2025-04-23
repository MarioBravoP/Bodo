/*---------------------------------------------------------------*\
 * connectDB.js
 * 
 * Configuración y conexión a la base de datos MongoDB utilizando Mongoose.
 * 
 * Funcionalidad principal:
 * - Establece la conexión con MongoDB utilizando las credenciales almacenadas en las variables de entorno.
 * - Maneja errores durante la conexión y termina el proceso si ocurre un fallo.
 * 
 * Variables:
 * - `MONGO_URI`: URI de conexión a la base de datos MongoDB.
 * - `NODE_ENV`: Define el entorno actual (desarrollo, producción, etc.), utilizado para loguear un mensaje informativo.
 * 
 * Dependencias:
 * - `mongoose`: ORM para interactuar con MongoDB de forma más sencilla.
 * 
 * Mensajes:
 * - Se loguea un mensaje indicando el estado de la conexión o el error de conexión en la consola.
 * 
\*---------------------------------------------------------------*/

import mongoose from "mongoose";
import logger from "../utils/logger.js";

// Función para conectar a la base de datos MongoDB
const connectDB = async () => {
    try {
        // Establecer la conexión con MongoDB usando la URI desde las variables de entorno
        await mongoose.connect(process.env.MONGO_URI);

        // Loguear mensaje de éxito indicando el entorno en el que se está ejecutando
        logger.info(`Conexión realizada con MongoDB (${process.env.NODE_ENV})`);
    } catch (error) {
        // Loguear error en caso de fallo en la conexión
        logger.error("Error al conectar con MongoDB:", error);

        // Terminar el proceso con código de error 1 en caso de fallo en la conexión
        process.exit(1);
    }
};

export default connectDB;
