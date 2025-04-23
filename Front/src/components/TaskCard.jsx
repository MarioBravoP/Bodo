/*---------------------------------------------------------------*\
 * TaskCard.jsx
 * 
 * Componente que representa una tarjeta de tarea dentro de una lista de tareas.
 * - Muestra el título de la tarea, su prioridad y la fecha de creación.
 * - Permite hacer clic en la tarjeta para ejecutar una función pasada como prop.
 * - Implementa la funcionalidad de arrastrar y soltar (drag-and-drop) para reorganizar tareas.
 * 
 * Propósito:
 * - Ofrecer una representación visual de las tareas con información clave.
 * - Permitir la interacción con la tarea a través de clics y arrastrar.
 * 
 * Hooks usados:
 * - Ninguno en este caso, ya que el estado se maneja a través de las props.
 * 
 * Funcionamiento:
 * - La tarjeta muestra el título, prioridad y la fecha de creación de la tarea.
 * - Al hacer clic en la tarjeta, ejecuta la función `onClick` pasada como prop.
 * - Implementa la funcionalidad de arrastrar y soltar utilizando el atributo `draggable` y el evento `onDragStart`.
 * 
 *--------------------------------------------------------------*/

import styles from './TaskCard.module.css';
import { formatDate } from '@/utils/formatDate';

const TaskCard = ({ task, onClick, setDraggedTaskId }) => {

    // Función para manejar el inicio del evento de arrastre
    const handleDragStart = () => {
        if (setDraggedTaskId) {
            setDraggedTaskId(task._id); // Establece el ID de la tarea que se está arrastrando
        }
    };

    return (
        <div className={styles['task-card']} onClick={() => onClick(task)} draggable="true" onDragStart={handleDragStart}>
            {/* Título de la tarea */}
            <h4 className={styles['task-card__title']}>{task.title}</h4>

            {/* Prioridad de la tarea */}
            <p className={styles['task-card__priority']}>
                Prioridad: {task.priority === 'low' ? 'Baja' :
                    task.priority === 'medium' ? 'Media' : 'Alta'}
            </p>

            {/* Fecha de creación de la tarea */}
            <p className={styles['task-card__created-at']}>
                Creado el: {formatDate(task.createdAt)}
            </p>
        </div>
    );
};

export default TaskCard;
