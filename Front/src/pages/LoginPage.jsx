/*---------------------------------------------------------------*\
 * LoginPage.jsx
 * 
 * Página de inicio de sesión.
 * 
 * Funcionalidad:
 * - Validación de login.
 * - Mostrar mensajes de error o éxito usando ToastContainer.
 * 
 * Hooks y Componentes:
 * - `useState`: Para manejar los campos de email, contraseña y errores.
 * - `useEffect`: Para redirigir si el usuario ya está logueado o mostrar el error persistente.
 * - `useAuth`: Proveer los métodos de autenticación.
 * - `ToastContainer`: Mostrar mensajes de notificación.
 * 
\*---------------------------------------------------------------*/

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ToastContainer from '@/components/ToastContainer';
import styles from './Login.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const toastContainerRef = useRef();

  // Estados para email y password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirigir automáticamente si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/');
    }

    // Verificar si hay un error persistente en localStorage
    const authError = localStorage.getItem('authError');
    if (authError) {
      // Si existe, mostramos el mensaje de error en un toast
      toastContainerRef.current?.addToast(authError, 'error');

      // Limpiamos el mensaje de error de localStorage para evitar que se repita
      localStorage.removeItem('authError');
    }
  }, [user, navigate, loading]);

  // Función que maneja el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que se envíe el formulario de forma predeterminada

    if (!email || !password) {
      toastContainerRef.current?.addToast('Por favor, completa ambos campos.', 'error');
      return; // Detiene el flujo aquí si hay un error
    }

    try {
      
      const normalizedEmail = email.trim().toLowerCase();
      const result = await login(normalizedEmail, password);

      if (result.success) {
        navigate('/');
      } else {
        toastContainerRef.current?.addToast(result.message, 'error');
        // Guardar el error en localStorage para mostrarlo después del refresco
        localStorage.setItem('authError', result.message);
      }
    } catch (err) {
      console.error('Error inesperado en handleLogin:', err);
      // Si ocurre un error, muestra el mensaje correspondiente
      toastContainerRef.current?.addToast(err.message || 'Error inesperado al iniciar sesión', 'error');
      // Guardar el error en localStorage para mostrarlo después del refresco
      localStorage.setItem('authError', err.message || 'Error inesperado al iniciar sesión');
    }
  };

  return (
    <div className={styles.login}>
      <ToastContainer ref={toastContainerRef} />
      <h2 className={styles.login__title}>Iniciar Sesión</h2>

      <form className={styles.login__form} onSubmit={handleLogin}>
        {/* Campo de entrada para el correo electrónico */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.login__input}
          required
        />

        {/* Campo de entrada para la contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.login__input}
          required
        />

        {/* Botón para enviar el formulario de login */}
        <button
          type="submit"
          className={styles.login__button}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
