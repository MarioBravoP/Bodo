/*---------------------------------------------------------------*\
 * NotFoundPage.jsx
 * 
 * Página de error 404.
 * 
 * Funcionalidad:
 * - Mostrar un mensaje amigable cuando el usuario accede a una ruta no existente.
 * - Proporcionar un enlace para volver al inicio de la aplicación.
 * 
 * Hooks y Componentes:
 * - `Link`: Componente de react-router-dom para navegación interna.
 * 
\*---------------------------------------------------------------*/

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.notfound}>
      {/* Título de error 404 */}
      <h1 className={styles.notfound__title}>404</h1>

      {/* Mensaje de error descriptivo */}
      <p className={styles.notfound__text}>¡Lo siento, esta página no existe!</p>

      {/* Enlace para regresar a la página principal */}
      <Link to="/" className={styles.notfound__link}>
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;
