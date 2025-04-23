/*---------------------------------------------------------------*\
 * CookieBanner.jsx
 * 
 * Componente que muestra un banner de aceptación de cookies.
 * - Muestra el banner si el usuario no ha aceptado previamente las cookies.
 * - Al aceptar, se guarda una cookie para recordar la elección del usuario por 1 año.
 * 
 * Hooks usados:
 * - `useState`: Para controlar la visibilidad del banner.
 * - `useEffect`: Para verificar si el usuario ya ha aceptado las cookies.
 * 
 * Propósito: Garantizar el cumplimiento de las normativas de cookies mostrando un banner informativo y permitiendo al usuario aceptar las cookies.
 * 
 * Funcionamiento:
 * - Al montar el componente, verifica si la cookie `cookies_accepted` existe.
 * - Si no existe, el banner se hace visible.
 * - Al hacer clic en "Aceptar", se guarda la cookie por 1 año y se oculta el banner.
 * 
 * Futuras mejoras:
 * Página con la política de cookies.
 * 
 *--------------------------------------------------------------*/

import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

const CookieBanner = () => {
  // Estado que controla si el banner es visible o no
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Comprobamos si el usuario ya ha aceptado las cookies
    const cookiesAccepted = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('cookies_accepted='));
    if (!cookiesAccepted) {
      setIsVisible(true); // Si no ha aceptado, mostramos el banner
    }
  }, []);

  // Función que maneja la aceptación de cookies
  const handleAcceptCookies = () => {
    // Guardamos la cookie para recordar que el usuario ha aceptado por 1 año
    document.cookie = 'cookies_accepted=true; path=/; max-age=31536000'; // 1 año
    setIsVisible(false); // Ocultamos el banner
  };

  // Si el banner no debe ser visible, no renderizamos nada
  if (!isVisible) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.cookieBanner__message}>
        Este sitio web usa cookies para mejorar la experiencia del usuario. Al continuar navegando, aceptas el uso de cookies.
      </div>
      <button className={styles.cookieBanner__button} onClick={handleAcceptCookies}>
        Aceptar
      </button>
    </div>
  );
};

export default CookieBanner;
