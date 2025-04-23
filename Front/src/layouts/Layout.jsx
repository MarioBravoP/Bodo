/*---------------------------------------------------------------*\
 * Layout.jsx
 * 
 * Componente de disposición (layout) que envuelve el contenido de la página.
 * - Proporciona una estructura común para todas las páginas, con un encabezado, 
 *   contenido principal y pie de página.
 * 
 * Propósito:
 * - Organizar la disposición de los elementos comunes de la interfaz de usuario 
 *   en una página: encabezado, cuerpo principal y pie de página.
 * - Reutilizar la estructura en diversas páginas de la aplicación, 
 *   asegurando una experiencia visual consistente.
 * 
 * Hooks usados:
 * - Ninguno en este caso.
 * 
 * Funcionamiento:
 * - El componente `Layout` recibe como `children` el contenido dinámico 
 *   que se va a mostrar en la página, el cual se inserta en el área principal de la disposición.
 * - Los componentes `Header` y `Footer` se renderizan de forma estática, proporcionando 
 *   una estructura consistente en todas las páginas.
 * 
 *--------------------------------------------------------------*/

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './Layout.module.css';   

// Componente Layout que organiza los elementos comunes de la página
const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      {/* Renderiza el encabezado */}
      <Header />
      
      {/* Área principal de la página, donde se insertan los contenidos dinámicos */}
      <main className={styles.mainContent}>
        {children}
      </main>
      
      {/* Renderiza el pie de página */}
      <Footer />
    </div>
  );
};

export default Layout;
