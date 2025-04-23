/*---------------------------------------------------------------*\
 * BoardPage.jsx
 * 
 * Página que muestra el tablero con sus tareas, miembros y propietario. Permite
 * ver, editar, y mover tareas entre columnas de un tablero. Además, permite interactuar
 * con los detalles de cada tarea y navegar a otras páginas.
 * 
 * Propósito:
 * - Mostrar un tablero con las tareas organizadas por su estado (por hacer, en progreso, completadas).
 * - Permitir arrastrar y soltar tareas entre las diferentes columnas.
 * - Mostrar detalles de cada tarea al hacer clic sobre ellas.
 * - Permitir la creación de nuevas tareas.
 * 
 * Hooks usados:
 * - `useState`: Para gestionar los estados de tareas, tablero, tarea seleccionada, etc.
 * - `useEffect`: Para cargar los datos del tablero y las tareas cuando cambia el ID del tablero.
 * - `useRef`: Para mantener el ID de la tarea que se está arrastrando.
 * - `useParams`, `useNavigate`: Para manejar la navegación y obtener el ID del tablero desde la URL.
 * 
 * Funcionamiento:
 * - Carga los datos del tablero y las tareas desde el backend cuando se monta el componente.
 * - Las tareas se organizan en 3 columnas según su estado: "Por hacer", "En progreso" y "Completadas".
 * - Se puede arrastrar y soltar tareas entre estas columnas, lo que actualiza su estado.
 * - El usuario puede hacer clic en una tarea para ver los detalles y editarla.
 * - La vista de detalles de la tarea se muestra en un sidebar cuando se selecciona una tarea.
 * 
 *--------------------------------------------------------------*/

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import styles from './BoardPage.module.css';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from '@/components/TaskCard'; 
import TaskDetailsSidebar from '@/components/TaskDetailsSidebar'; 
import { handleDrop, handleDragOver } from '@/utils/dragAndDropUtils';

const BoardPage = () => {
    const { user } = useAuth();  // Obtener información del usuario autenticado
    const { boardId } = useParams();  // Obtener el ID del tablero de la URL
    const { data, error, loading, fetchData } = useFetch();  // Hook para hacer peticiones al backend
    const [tasks, setTasks] = useState([]);  // Estado para las tareas del tablero
    const [board, setBoard] = useState(null);  // Estado para el tablero
    const [selectedTask, setSelectedTask] = useState(null);  // Estado para la tarea seleccionada
    const navigate = useNavigate();  // Hook para la navegación
    const draggedTaskId = useRef(null);  // Referencia para el ID de la tarea que se está arrastrando

    // Efecto que carga el tablero y las tareas cuando cambia el ID del tablero
    useEffect(() => {
        if (boardId) {
            fetchData(`/api/board/${boardId}`, 'GET');  // Obtener datos del tablero
        }
    }, [boardId]);

    // Efecto que se activa cuando los datos del tablero son cargados
    useEffect(() => {
        if (data && !board) {
            setBoard(data.board);  // Guardar la información del tablero
            setTasks(data.tasks || []);  // Guardar las tareas del tablero
        }
    }, [data]);

    // Función personalizada para manejar el evento de soltar una tarea en una columna
    const customHandleDrop = async (e, status) => {
        e.preventDefault();  // Prevenir el comportamiento por defecto del navegador
        if (draggedTaskId.current) {
            // Actualizar el estado de la tarea (de acuerdo a la columna donde se suelta)
            await handleDrop(e, status, fetchData, handleTaskUpdate, draggedTaskId.current);
            draggedTaskId.current = null;  // Limpiar la referencia
        }
    };

    // Función para guardar el ID de la tarea que se está arrastrando
    const setDraggedTaskId = (id) => {
        draggedTaskId.current = id;
    };

    // Función para navegar a la página de edición del tablero
    const handleEditClick = () => {
        navigate(`/edit-board/${boardId}`);  // Navegar a la página de edición del tablero
    };

    // Función para manejar el clic en una tarea y mostrar sus detalles
    const handleTaskClick = (task) => {
        setSelectedTask(task);  // Establecer la tarea seleccionada
    };

    // Función para cerrar el sidebar de detalles de la tarea
    const handleCloseSidebar = () => {
        setSelectedTask(null);  // Limpiar la tarea seleccionada
    };

    // Función para actualizar las tareas después de una acción (como mover o eliminar)
    const handleTaskUpdate = (action, updatedTask) => {
        if (action === 'update') {
            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))  // Actualizar tarea
            );
        } else if (action === 'delete') {
            setTasks(prevTasks =>
                prevTasks.filter(task => task._id !== updatedTask._id)  // Eliminar tarea
            );
        }
    };

    // Función para filtrar las tareas por su estado
    const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

    // Si hay un error, mostrar un mensaje de error
    if (error) return <p>Error al cargar el tablero.</p>;
    if (!board) return null;  // Si no se ha cargado el tablero, no renderizar nada

    return (
        <div className={styles['board']}>
            <div className={styles['board__header']}>
                <div className={styles['board__title-container']}>
                    <h2 className={styles['board__title']}>{board.title}</h2>
                    {/* Solo el propietario puede editar el tablero */}
                    {board.owner._id === user?._id && (
                        <button className={styles['board__edit-btn']} onClick={handleEditClick}>
                            Editar Tablero
                        </button>
                    )}
                </div>

                {board.description && (
                    <p className={styles['board__description']}>{board.description}</p>  // Mostrar la descripción del tablero
                )}

                <div className={styles['board__owner-item']}>
                    <span className={styles['board__owner-title']}>Propietario:</span>
                    <div className={styles['board__person-item']}>
                        <picture>
                            <source srcSet={board.owner.profileImage || '/images/default-profile.png'} type="image/webp" />
                            <img
                                src={board.owner.profileImage || '/images/default-profile.png'}
                                alt={`${board.owner.name}`}
                                className={styles['board__person-image']}
                            />
                        </picture>
                        <div className={styles['board__person-texts']}>
                            <span className={styles['board__person-name']}>{board.owner.name}</span>
                            <span className={styles['board__person-email']}>{board.owner.email}</span>
                        </div>
                    </div>
                </div>

                <div className={styles['board__members']}>
                    <span className={styles['board__members-title']}>Miembros:</span>
                    <div className={styles['board__members-list']}>
                        {board.members.map(member => (
                            <div key={member._id} className={styles['board__person-item']}>
                                <picture>
                                    <source srcSet={member.profileImage || '/images/default-profile.png'} type="image/webp" />
                                    <img
                                        src={member.profileImage || '/images/default-profile.png'}
                                        alt={`${member.name}'s profile`}
                                        className={styles['board__person-image']}
                                    />
                                </picture>
                                <div className={styles['board__person-texts']}>
                                    <span className={styles['board__person-name']}>{member.name}</span>
                                    <span className={styles['board__person-email']}>{member.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className={styles['board__tasks-section']}>
                <h3 className={styles['board__tasks-title']}>Tareas</h3>

                <div className={styles['board__columns-container']}>
                    {/* Renderizar las tareas por estado */}
                    <div
                        className={styles['board__column']}
                        onDragOver={handleDragOver}  // Habilitar el arrastre de tareas
                        onDrop={(e) => customHandleDrop(e, 'todo')}  // Manejar el drop de tareas en esta columna
                    >
                        <h4 className={styles['board__column-title']}>Por hacer</h4>
                        <ul className={styles['board__tasks-list']}>
                            {getTasksByStatus('todo').map(task => (
                                <li key={task._id}>
                                    <TaskCard
                                        task={task}
                                        onClick={() => handleTaskClick(task)}  // Mostrar los detalles de la tarea al hacer clic
                                        setDraggedTaskId={setDraggedTaskId}  // Manejar el arrastre de la tarea
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className={styles['board__column']}
                        onDragOver={handleDragOver}
                        onDrop={(e) => customHandleDrop(e, 'in_progress')}
                    >
                        <h4 className={styles['board__column-title']}>En progreso</h4>
                        <ul className={styles['board__tasks-list']}>
                            {getTasksByStatus('in_progress').map(task => (
                                <li key={task._id}>
                                    <TaskCard
                                        task={task}
                                        onClick={() => handleTaskClick(task)}
                                        setDraggedTaskId={setDraggedTaskId}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className={styles['board__column']}
                        onDragOver={handleDragOver}
                        onDrop={(e) => customHandleDrop(e, 'done')}
                    >
                        <h4 className={styles['board__column-title']}>Completadas</h4>
                        <ul className={styles['board__tasks-list']}>
                            {getTasksByStatus('done').map(task => (
                                <li key={task._id}>
                                    <TaskCard
                                        task={task}
                                        onClick={() => handleTaskClick(task)}
                                        setDraggedTaskId={setDraggedTaskId}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button className={styles['board__create-task-btn']} onClick={() => navigate(`/create-task/${boardId}`)}>
                    Crear Nueva Tarea
                </button>
            </section>

            {/* Sidebar para ver los detalles de la tarea seleccionada */}
            {selectedTask && (
                <TaskDetailsSidebar
                    task={selectedTask}
                    onClose={handleCloseSidebar}
                    onUpdate={handleTaskUpdate}
                />
            )}
        </div>
    );
};

export default BoardPage;
