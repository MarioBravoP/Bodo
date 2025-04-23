/*---------------------------------------------------------------*\
 * cloudinaryConfig.js
 * 
 * Configuración de Cloudinary para la gestión de imágenes.
 * 
 * Funcionalidad principal:
 * - Configura las credenciales necesarias para interactuar con el servicio de Cloudinary.
 * - Carga las variables de entorno desde el archivo `.env` para una configuración segura.
 * 
 * Variables:
 * - `CLOUDINARY_CLOUD_NAME`: El nombre del cloud en Cloudinary.
 * - `CLOUDINARY_API_KEY`: La clave API para autenticar las solicitudes.
 * - `CLOUDINARY_API_SECRET`: La clave secreta API para autenticar las solicitudes.
 * 
 * Dependencias:
 * - `cloudinary`: Biblioteca de Cloudinary para interactuar con su API.
 * - `dotenv`: Biblioteca que carga variables de entorno desde el archivo `.env`.
 * 
\*---------------------------------------------------------------*/

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar Cloudinary con las credenciales del entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
