/*---------------------------------------------------------------*\
 * AuthContext.jsx
 * 
 * Contexto de autenticación que gestiona el estado del usuario, 
 * el inicio y cierre de sesión, y la verificación del token de autenticación.
 * 
 * Propósito:
 * - Proveer el estado de autenticación del usuario y funciones relacionadas 
 *   a la autenticación a través de un contexto global en la aplicación.
 * - Permitir el acceso a la información de autenticación (usuario, login, logout) 
 *   desde cualquier componente mediante el hook `useAuth`.
 * 
 * Hooks usados:
 * - `useState`: Para manejar el estado del usuario y el estado de carga (`loading`).
 * - `useEffect`: Para ejecutar la verificación de autenticación cuando el componente se monta.
 * - `useContext`: Para acceder al contexto de autenticación a través del hook `useAuth`..
 * 
 * Funciones clave:
 * - `checkAuth`: Verifica si el usuario está autenticado al validar el token.
 * - `login`: Permite autenticar al usuario mediante el envío de un email y contraseña.
 * - `logout`: Permite cerrar la sesión del usuario.
 * 
 *--------------------------------------------------------------*/

import { createContext, useState, useEffect, useContext } from 'react';
import axios from '@/services/axiosService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Componente proveedor que envuelve la aplicación con el contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario actual y el estado de carga (loading)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función que obtiene el token desde las cookies
  const getTokenFromCookie = () => {
    // Buscar la cookie que empieza con 'token='
    const tokenCookie = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('token='));
    
    // Si se encuentra el token, devolverlo, de lo contrario, devolver null
    return tokenCookie?.split('=')[1] || null;
  };

  // Función para verificar si el usuario está autenticado
  const checkAuth = async () => {
    const token = getTokenFromCookie(); // Obtener el token de las cookies
    
    // Si no existe un token, el usuario no está autenticado
    if (!token) {
      setUser(null); // No hay usuario autenticado
      setLoading(false); // Cambiar el estado de carga
      return;
    }

    try {
      // Intentar verificar el token con el backend
      const response = await axios.get('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Si la respuesta contiene un usuario, actualizar el estado
      if (response.data?.user) {
        setUser(response.data.user); // Almacenar los datos del usuario
      } else {
        setUser(null); // Si no se encuentra un usuario, establecer el usuario como null
      }
    } catch (error) {
      console.error('Error verificando el token:', error);
      setUser(null); // Si hay un error, también eliminar al usuario
    } finally {
      // Una vez realizada la verificación, establecer loading a false
      setLoading(false);
    }
  };

  // Efecto que ejecuta la verificación de autenticación al iniciar el componente
  useEffect(() => {
    checkAuth(); // Llamada a la función que verifica si el usuario está autenticado
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });

      // Si la autenticación es exitosa, guardar el token en las cookies y el usuario en el estado
      if (response.status === 200) {
        const token = response.data.token;
        const userData = response.data.user;
        document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;
        setUser(userData);
        checkAuth();
        return { success: true };
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Si ocurre un error, guardar el mensaje en localStorage para mostrarlo después del refresco
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      localStorage.setItem('authError', errorMessage); // Guardamos el mensaje de error

      return {
        success: false,
        message: errorMessage, // Devolvemos el mensaje de error para mostrarlo en el login
      };
    } finally {
      setLoading(false); // Restablecer el estado de carga
    }
  };

  // Función para cerrar sesión (logout)
  const logout = () => {
    // Eliminar el token de las cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null); // Eliminar el usuario del estado
  };

  // Proveer el contexto con los valores necesarios
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children} {/* Renderiza los hijos que consumen el contexto */}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext); // Obtener el contexto de autenticación

  // Si el hook no se usa dentro de un AuthProvider, lanzar un error
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context; // Retornar el contexto con la información del usuario, login, logout, y loading
};
