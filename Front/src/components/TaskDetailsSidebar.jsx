/*---------------------------------------------------------------*\
 * TaskDetailsSidebar.jsx
 * 
 * Componente que permite ver y editar los detalles de una tarea, así como eliminarla.
 * - Muestra un formulario para editar el título, descripción, estado, prioridad y etiquetas de la tarea.
 * - Permite al usuario eliminar la tarea después de una confirmación.
 * - Se conecta a una API para actualizar y eliminar la tarea.
 * 
 * Propósito:
 * - Proveer una vista y controles interactivos para modificar una tarea existente.
 * - Permitir la eliminación de una tarea con confirmación.
 * 
 * Hooks usados:
 * - `useState`: Para gestionar el estado local del formulario de tarea y el estado de la confirmación de eliminación.
 * - `useFetch`: Para realizar las peticiones HTTP a la API para actualizar o eliminar la tarea.
 * 
 * Funcionamiento:
 * - **Formulario de edición**: Permite al usuario modificar el título, descripción, estado y prioridad de la tarea. Al enviar el formulario, se realiza una petición `PUT` a la API para actualizar la tarea.
 * - **Eliminación de tarea**: Al hacer clic en el botón de eliminar, se muestra una ventana de confirmación. Si se confirma, se realiza una petición `DELETE` a la API para eliminar la tarea.
 * - **Carga y gestión de estado**: El componente maneja un estado de carga (para mostrar un mensaje cuando se están guardando cambios) y de confirmación de eliminación de la tarea.
 * 
 *--------------------------------------------------------------*/

import { useState } from 'react';
import useFetch from '@/hooks/useFetch';
import { formatDate } from '@/utils/formatDate';
import styles from './TaskDetailsSidebar.module.css';

const TaskSidebar = ({ task, onClose, onUpdate }) => {
    const { fetchData, loading } = useFetch();
    const maxTitleLength = 40;
    const maxDescriptionLength = 150;

    // Estado local para almacenar los valores editados de la tarea
    const [editedTask, setEditedTask] = useState({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'low',
        tags: task.tags || [],
    });

    // Estado para manejar la visibilidad de la confirmación de eliminación
    const [showConfirm, setShowConfirm] = useState(false);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Maneja el envío del formulario para actualizar la tarea
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editedTask.description.length > maxDescriptionLength || editedTask.title.length > maxTitleLength) {
            toastRef.current?.addToast('No se puede superar el límite de caracteres.', 'error');
            return;
        }

        try {
            const updatedTask = await fetchData(`/api/task/${task._id}`, 'PUT', editedTask);
            if (updatedTask) {
                onUpdate('update', updatedTask.task); // Actualiza la tarea en el componente padre
                onClose();
            }
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    // Muestra el cuadro de confirmación para eliminar la tarea
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    // Cancela la acción de eliminación
    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    // Confirma y elimina la tarea
    const handleConfirmDelete = async () => {
        try {
            await fetchData(`/api/task/${task._id}`, 'DELETE'); // Elimina la tarea de la API
            onUpdate('delete', task); // Notifica al componente padre que se eliminó la tarea
            onClose();
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    };

    return (
        <div className={styles.sidebar}>
            <button onClick={onClose} className={styles.closeButton}>✖</button>
            <div className={styles.content}>
                <h2>Editar Tarea</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={editedTask.title}
                            onChange={handleChange}
                            required
                            maxLength={maxTitleLength}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={editedTask.description || ''}
                            onChange={handleChange}
                            maxLength={maxDescriptionLength}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Estado</label>
                        <select name="status" value={editedTask.status} onChange={handleChange}>
                            <option value="todo">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="done">Completada</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Prioridad</label>
                        <select name="priority" value={editedTask.priority} onChange={handleChange}>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.saveButton} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>

                {/* Última actualización */}
                <p className={styles['task-details__updated-at']}>
                    Última actualización: {formatDate(task.updatedAt)}
                </p>

                {/* Confirmación de eliminación */}
                {showConfirm && (
                    <div className={styles.confirmationOverlay}>
                        <div className={styles.confirmationBox}>
                            <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
                            <button className={styles.confirmBtn} onClick={handleConfirmDelete}>Sí</button>
                            <button className={styles.cancelBtn} onClick={handleCancelDelete}>No</button>
                        </div>
                    </div>
                )}

                {/* Botón de eliminar tarea */}
                <button className={styles.deleteBtn} onClick={handleDeleteClick}>
                    Eliminar Tarea
                </button>

            </div>
        </div>
    );
};

export default TaskSidebar;
