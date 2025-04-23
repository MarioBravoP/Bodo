/*---------------------------------------------------------------*\
 * axiosInstance.js
 * 
 * Configura una instancia de axios para hacer peticiones a la API.
 * Añade un interceptor para incluir el token de autenticación
 * en los headers de cada solicitud si está disponible.
\*---------------------------------------------------------------*/

import axios from 'axios';

// Crear una instancia de axios con una URL base definida en las variables de entorno
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Se utiliza la URL base de la API desde las variables de entorno
});

// Interceptor para añadir el token de autorización en los headers de las peticiones
instance.interceptors.request.use((config) => {
  // Obtener el token de las cookies (si está presente)
  const token = document.cookie
    .split('; ') // Divide las cookies por ';'
    .find(cookie => cookie.startsWith('token=')) // Busca la cookie que comienza con 'token='
    ?.split('=')[1]; // Extrae el valor del token

  // Si el token existe, se añade al header de la solicitud
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Devuelve la configuración modificada para la solicitud
  return config;
}, (error) => {
  // Si hay un error en la solicitud, lo rechazamos
  return Promise.reject(error);
});

export default instance; // Exporta la instancia configurada de axios
