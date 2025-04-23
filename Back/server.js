/*---------------------------------------------------------------*\
 * server.js
 * 
 * Configuración principal del servidor Express.
 * 
 * Funcionalidad:
 * - Configura el servidor Express, las rutas de la API y los middlewares.
 * - Establece la conexión a la base de datos MongoDB.
 * - Configura CORS para permitir peticiones desde el Frontend.
 * - Incluye manejo de errores y rutas no encontradas.
 * 
 * Dependencias:
 * - `express`: Framework de Node.js para gestionar las rutas y el servidor.
 * - `cors`: Middleware para habilitar CORS (Cross-Origin Resource Sharing).
 * - `dotenv`: Permite el manejo de variables de entorno.
 * - `errorHandler`, `notFoundHandler`: Middlewares personalizados para manejar errores y rutas no encontradas.
 * - `authRoutes`, `userRoutes`, `boardRoutes`, `taskRoutes`: Rutas para las funcionalidades de autenticación, usuarios, tableros y tareas.
 * - `connectDB`: Función para establecer la conexión con la base de datos MongoDB.
 * - `PORT`, `FRONTEND_URL`: Variables de configuración para el puerto y el frontend.
 * 
 *---------------------------------------------------------------*/

// Importamos las dependencias necesarias
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler, notFoundHandler } from "./src/middlewares/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import boardRoutes from "./src/routes/boardRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import authMiddleware from "./src/middlewares/authMiddleware.js"; 

// Importamos las configuraciones necesarias
import connectDB from "./src/config/db.js";
import { PORT, FRONTEND_URL } from "./src/config/appConfig.js";

// Cargar las variables de entorno solo en entornos de desarrollo
if (process.env.NODE_ENV !== "production") { dotenv.config(); }

const app = express();  // Crear una instancia de Express

// Configurar Express para que maneje JSON y formularios con tamaño límite de 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Habilitar CORS para permitir solicitudes desde el Frontend
app.use(cors({ origin: FRONTEND_URL }));

// Conexión a la base de datos MongoDB
connectDB();

// Definir las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/board', authMiddleware, boardRoutes);
app.use('/api/task', authMiddleware, taskRoutes); 

// Middleware para manejar rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware para manejar errores generales
app.use(errorHandler);

// Exportar la aplicación para su uso en entornos de desarrollo o producción
export default app;

// Iniciar el servidor solo si no estamos en producción (útil para Vercel)
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
    });
}
