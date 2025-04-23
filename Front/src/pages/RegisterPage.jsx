/*---------------------------------------------------------------*\
 * RegisterPage.jsx
 * 
 * Página de registro de usuarios.
 * Permite crear un nuevo usuario proporcionando nombre, email y contraseña.
 * 
 * Funcionalidad principal:
 * - Validar que todos los campos estén completos.
 * - Enviar datos al servidor para crear una nueva cuenta.
 * - Mostrar notificaciones de éxito o error mediante Toasts.
 * 
 * Hooks y Componentes:
 * - `useFetch`: Para gestionar la solicitud de registro.
 * - `ToastContainer`: Para mostrar mensajes de feedback.
 * 
\*---------------------------------------------------------------*/

import { useState, useRef } from 'react';
import useFetch from '@/hooks/useFetch';
import ToastContainer from '@/components/ToastContainer';
import styles from './Register.module.css';

const RegisterPage = () => {
  const { fetchData, loading, error } = useFetch();
  const toastRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [success, setSuccess] = useState(false);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulario de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    // Validar que no haya campos vacíos
    if (!formData.name || !formData.email || !formData.password) {
      toastRef.current?.addToast('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      // Realizar solicitud de registro
      await fetchData('/api/auth/register', 'POST', formData);
      setSuccess(true);
      toastRef.current?.addToast('Usuario creado con éxito', 'success');
      setFormData({ name: '', email: '', password: '' }); // Limpiar formulario tras éxito
    } catch (err) {
      toastRef.current?.addToast('Error al crear usuario', 'error');
    }
  };

  return (
    <>
      <div className={styles.register}>

        <h2 className={styles.register__title}>Crear nuevo usuario</h2>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className={styles.register__form}>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className={styles.register__input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className={styles.register__input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className={styles.register__input}
            required
          />
          <button
            type="submit"
            className={styles.register__button}
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

      </div>

      {/* Contenedor de notificaciones */}
      <ToastContainer ref={toastRef} />
    </>
  );
};

export default RegisterPage;
