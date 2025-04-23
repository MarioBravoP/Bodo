/*---------------------------------------------------------------*\
 * useFetch.js
 * 
 * Hook personalizado para realizar solicitudes HTTP (con axios) y manejar 
 * el estado de la respuesta (datos, error, carga) de manera centralizada.
 * 
 * Propósito:
 * - Facilitar la realización de solicitudes HTTP dentro de los componentes.
 * - Proveer un manejo de estado para los datos obtenidos, los errores ocurridos 
 *   y el estado de carga, todo de manera sencilla y reutilizable.
 * 
 * Hooks usados:
 * - `useState`: Para manejar los estados de `data`, `error`, y `loading`.
 * 
 * Funciones clave:
 * - `fetchData`: Realiza la solicitud HTTP usando axios, actualiza el estado de los datos
 *   y maneja los errores, además de controlar el estado de carga.
 * 
 *--------------------------------------------------------------*/

import { useState } from 'react';
import axios from '@/services/axiosService';

// Hook personalizado para realizar solicitudes HTTP y gestionar el estado
const useFetch = () => {
  // Estado para almacenar los datos, el error y el estado de carga
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para hacer la solicitud HTTP
  const fetchData = async (url, method = 'GET', body = null, headers = {}) => {
    // Establecer el estado de carga en true y resetear los errores
    setLoading(true);
    setError(null);

    // Crear un controlador de abortos para poder cancelar la solicitud si es necesario
    const controller = new AbortController();
    try {
      // Realizar la solicitud HTTP usando axios
      const response = await axios({
        url,              // URL a la que se hace la solicitud
        method,           // Método HTTP (GET, POST, PUT, DELETE, etc.)
        data: body,       // Datos para el cuerpo de la solicitud (si aplica)
        headers,          // Encabezados HTTP (si aplica)
        signal: controller.signal,  // Señal para poder abortar la solicitud
      });

      // Almacenar los datos de la respuesta en el estado
      setData(response.data);

      // Retornar los datos de la respuesta para ser utilizados en el componente
      return response.data;
    } catch (err) {
      // Si la solicitud fue cancelada, evitar tratarla como un error
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        if (process.env.NODE_ENV === 'development') {
          console.warn('La solicitud fue cancelada');
        }
        return;
      }

      // Si ocurre un error, almacenar el mensaje de error en el estado
      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMsg);

      // Log de error solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.error('useFetch error:', errorMsg);
      }

      // Lanzar el error para ser manejado por el componente si lo requiere
      throw err;
    } finally {
      // Al finalizar la solicitud (ya sea exitosa o con error), cambiar el estado de carga a false
      setLoading(false);
    }
  };

  // Retornar el estado y la función para hacer solicitudes
  return { data, error, loading, fetchData };
};

export default useFetch;
