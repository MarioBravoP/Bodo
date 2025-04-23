/*---------------------------------------------------------------*\
 * TaskFormPage.jsx
 * 
 * Página de creación de una nueva tarea dentro de un tablero específico.
 * 
 * Funcionalidad principal:
 * - Validar campos requeridos (título, estado, boardId).
 * - Enviar los datos de la tarea al servidor.
 * - Mostrar notificaciones de éxito o error mediante Toasts.
 * 
 * Hooks y Componentes:
 * - `useFetch`: Para enviar la tarea al servidor.
 * - `useNavigate`: Para redirigir tras crear la tarea.
 * - `ToastContainer`: Para mostrar mensajes de feedback.
 * 
\*---------------------------------------------------------------*/

import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import ToastContainer from '@/components/ToastContainer';
import styles from './TaskFormPage.module.css';

const TaskFormPage = () => {
    const { boardId } = useParams();
    const { fetchData } = useFetch();
    const navigate = useNavigate();
    const toastRef = useRef(null);

    // Estados locales para almacenar los datos del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [status, setStatus] = useState('todo');

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!title.trim()) {
            toastRef.current?.addToast('El título es obligatorio.', 'error');
            return;
        }
        if (!status) {
            toastRef.current?.addToast('Debes seleccionar un estado.', 'error');
            return;
        }
        if (!boardId) {
            toastRef.current?.addToast('No se encontró el ID del tablero.', 'error');
            return;
        }

        // Preparar datos para el envío
        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            board: boardId,
        };

        try {
            const response = await fetchData('/api/task/create', 'POST', taskData);
            if (response) {
                toastRef.current?.addToast('Tarea creada con éxito.', 'success');
                navigate(`/board/${boardId}`);
            }
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            toastRef.current?.addToast('Error al crear la tarea. Intenta de nuevo.', 'error');
        }
    };

    return (
        <div className={styles['task-form']}>
            {/* Contenedor de notificaciones */}
            <ToastContainer ref={toastRef} />

            <h2 className={styles['task-form__title']}>Crear Nueva Tarea</h2>

            {/* Formulario para crear tarea */}
            <form className={styles['task-form__form']} onSubmit={handleSubmit}>

                {/* Campo: Título */}
                <div className={styles['task-form__input-group']}>
                    <label className={styles['task-form__label']}>Título</label>
                    <input
                        className={styles['task-form__input']}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Campo: Descripción */}
                <div className={styles['task-form__input-group']}>
                    <label className={styles['task-form__label']}>Descripción</label>
                    <textarea
                        className={styles['task-form__textarea']}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Campo: Prioridad */}
                <div className={styles['task-form__input-group']}>
                    <label className={styles['task-form__label']}>Prioridad</label>
                    <select
                        className={styles['task-form__select']}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low" style={{ color: '#2e7d32' }}>Baja</option>
                        <option value="medium" style={{ color: '#fb8c00' }}>Media</option>
                        <option value="high" style={{ color: '#c62828' }}>Alta</option>
                    </select>
                </div>

                {/* Campo: Estado */}
                <div className={styles['task-form__input-group']}>
                    <label className={styles['task-form__label']}>Estado</label>
                    <select
                        className={styles['task-form__select']}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un estado</option>
                        <option value="todo">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="done">Completada</option>
                    </select>
                </div>

                {/* Botón de enviar */}
                <button type="submit" className={styles['task-form__button']}>
                    Crear Tarea
                </button>
            </form>
        </div>
    );
};

export default TaskFormPage;
