/*---------------------------------------------------------------*\
 * ToastContainer.jsx
 * 
 * Componente que gestiona las notificaciones (toasts) mostradas en la interfaz.
 * - Permite agregar, mostrar y eliminar notificaciones de forma dinámica.
 * - Soporta notificaciones con un botón de confirmación ("Sí" / "No") o con un botón de cierre.
 * 
 * Propósito:
 * - Mostrar mensajes temporales al usuario (como notificaciones) que pueden requerir una acción de confirmación.
 * - Permitir agregar notificaciones desde componentes padres mediante `addToast`.
 * 
 * Hooks usados:
 * - `useState`: Para gestionar el estado de las notificaciones.
 * - `useImperativeHandle`: Para exponer el método `addToast` al componente padre.
 * 
 * Funcionamiento:
 * - **Agregar notificación**: Se usa el método `addToast` para agregar una nueva notificación. El método recibe un mensaje, un tipo (información, advertencia, error, etc.) y opcionalmente una función `onConfirm` que se ejecuta cuando el usuario confirma la notificación.
 * - **Eliminar notificación**: Las notificaciones se eliminan automáticamente después de ser confirmadas o cuando el usuario cierra la notificación.
 * - **Confirmación**: Si la notificación requiere confirmación, se muestran los botones "Sí" y "No", y se ejecuta la función `onConfirm` pasada por el componente padre.
 * 
 *--------------------------------------------------------------*/

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './ToastContainer.module.css';

const ToastContainer = forwardRef((props, ref) => {
  // Estado para almacenar las notificaciones (toasts)
  const [toasts, setToasts] = useState([]);

  // Exponer el método addToast al componente padre para agregar nuevas notificaciones
  useImperativeHandle(ref, () => ({
    addToast: (message, type, onConfirm = null) => {
      const id = Date.now(); // Se utiliza el timestamp como id único
      setToasts((prevToasts) => [...prevToasts, { id, message, type, onConfirm }]);
    },
  }));

  // Eliminar una notificación por su id
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Maneja la confirmación de la notificación
  const handleConfirm = (id, confirm) => {
    const toast = toasts.find(t => t.id === id); // Buscar la notificación por id
    if (toast?.onConfirm) {
      toast.onConfirm(confirm); // Ejecutar la función de confirmación si existe
    }
    removeToast(id); // Eliminar la notificación
  };

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          <p>{toast.message}</p>
          {/* Si la notificación tiene una acción de confirmación */}
          {toast.onConfirm ? (
            <div className={styles.confirmButtons}>
              <button onClick={() => handleConfirm(toast.id, true)}>Sí</button>
              <button onClick={() => handleConfirm(toast.id, false)}>No</button>
            </div>
          ) : (
            // Si no hay confirmación, simplemente mostrar el botón de cierre
            <button onClick={() => removeToast(toast.id)}>Cerrar</button>
          )}
        </div>
      ))}
    </div>
  );
});

export default ToastContainer;
