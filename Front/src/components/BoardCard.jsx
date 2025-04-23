/*---------------------------------------------------------------*\
 * BoardCard.jsx
 * 
 * Componente que representa una tarjeta de tablero dentro de una lista.
 * - Muestra detalles clave del tablero: nombre, propietario, descripción, número de tareas y fecha de creación.
 * - Al hacer clic en la tarjeta, redirige al usuario a la página del tablero correspondiente.
 * 
 * Propósito:
 * - Ofrecer una representación visual de los tableros en la lista.
 * - Facilitar la navegación a la página específica del tablero al hacer clic.
 * 
 * Hooks usados:
 * - `useNavigate`: Para navegar a la página específica del tablero.
 * 
 * Funcionamiento:
 * - La tarjeta muestra un resumen del tablero, incluyendo título, propietario, descripción, número de tareas y fecha de creación.
 * - Al hacer clic en la tarjeta, el usuario es redirigido a la página del tablero usando el `navigate`.
 * 
 *--------------------------------------------------------------*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardCard.module.css';
import { formatDate } from '@/utils/formatDate';

// Importar las rutas desde el archivo de constantes
import ROUTES from '@/const/routes';

const BoardCard = ({ board }) => {
  const navigate = useNavigate(); // Hook de navegación para redirigir al tablero

  // Función que maneja el clic en la tarjeta y redirige al tablero específico
  const handleClick = () => {
    navigate(ROUTES.BOARD.replace(':boardId', board._id)); // Usar la ruta BOARD con el ID del tablero
  };

  return (
    // Tarjeta del tablero
    <li className={styles['board-card']} onClick={handleClick}>
      {/* Header - Nombre y Owner */}
      <div className={styles['board-card__header']}>
        <h3 className={styles['board-card__title']}>{board.title}</h3> {/* Título del tablero */}
        <p className={styles['board-card__owner']}>
          {board.owner?.name || 'Desconocido'} {/* Nombre del propietario, si existe */}
        </p>
      </div>

      {/* Body - Descripción */}
      <div className={styles['board-card__body']}>
        <p className={styles['board-card__description']}>
          {board.description || 'Sin descripción'} {/* Descripción del tablero */}
        </p>
      </div>

      {/* Footer - Tareas y fecha */}
      <div className={styles['board-card__footer']}>
        <span className={styles['board-card__task-count']}>
          <span>{board.taskCount || 0}</span> Tareas {/* Número de tareas en el tablero */}
        </span>
        <span className={styles['board-card__created-at']}>
          <span>{formatDate(board.createdAt)}</span> {/* Fecha de creación del tablero */}
        </span>
      </div>
    </li>
  );
};

export default BoardCard;
