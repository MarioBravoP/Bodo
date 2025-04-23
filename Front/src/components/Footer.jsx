/*---------------------------------------------------------------*\
 * Footer.jsx
 * 
 * Componente de pie de página para la aplicación.
 * - Muestra el texto de copyright con el año actual.
 * 
 * Propósito: El footer se coloca al final de la página y contiene información de derechos de autor.
 * 
 * Funcionamiento:
 * - Muestra dinámicamente el año actual.
 * - Usa un solo bloque de contenido estilizado.
 *--------------------------------------------------------------*/

import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <p className={styles.footer__text}>© {new Date().getFullYear()} Gestor de Tableros Bodo. Creado por Mario Bravo Pineda para el proyecto final del módulo de FullStack de CEI</p>
      </div>
    </footer>
  );
};

export default Footer;
