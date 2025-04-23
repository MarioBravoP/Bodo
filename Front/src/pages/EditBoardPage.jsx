/*---------------------------------------------------------------*\
 * EditBoardPage.jsx
 * 
 * Página de edición de un tablero. Permite a los usuarios editar
 * el título y la descripción de un tablero específico.
 * 
 * Propósito:
 * - Obtener los datos del tablero desde la API.
 * - Permitir al usuario editar los datos del tablero.
 * - Guardar los cambios realizados al tablero en la base de datos.
 * 
 * Hooks usados:
 * - `useState`: Para gestionar el estado de los campos del formulario (título y descripción).
 * - `useEffect`: Para cargar los datos del tablero cuando se monta el componente o cambia el ID del tablero.
 * - `useParams`, `useNavigate`: Para acceder al ID del tablero desde la URL y navegar tras guardar los cambios.
 * 
 * Funcionamiento:
 * - Cuando se monta el componente, se hace una petición a la API para cargar los datos del tablero.
 * - Los campos de título y descripción se llenan con los datos actuales del tablero.
 * - El usuario puede editar estos campos y luego enviar el formulario para actualizar el tablero.
 * - Los cambios se guardan a través de una petición PUT a la API.
 * 
 *---------------------------------------------------------------*/

import { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import styles from './EditBoardPage.module.css';

const EditBoardPage = () => {
    const { boardId } = useParams();  // Obtener el ID del tablero desde la URL
    const { data, error, loading, fetchData } = useFetch();  // Hook personalizado para obtener datos y realizar peticiones
    const navigate = useNavigate();  // Hook para la navegación

    // Estados para el título y la descripción del tablero
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Efecto que carga los datos del tablero cuando cambia el ID del tablero
    useEffect(() => {
        if (boardId) {
            fetchData(`/api/board/${boardId}`, 'GET')  // Petición GET para obtener los datos del tablero
                .then((response) => {
                    if (response) {
                        setTitle(response.board.title);  // Establecer el título en el estado
                        setDescription(response.board.description || '');  // Establecer la descripción, si existe
                    }
                })
                .catch((err) => console.error("Error al cargar el tablero:", err));  // Manejo de errores
        }
    }, [boardId]);  // El efecto se ejecuta cada vez que cambia el `boardId`

    // Función que maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        const updatedBoard = {
            title,  // Obtener el título actualizado
            description,  // Obtener la descripción actualizada
        };

        try {
            // Enviar una petición PUT para actualizar el tablero
            await fetchData(`/api/board/${boardId}`, 'PUT', updatedBoard);

            // Navegar de vuelta a la página del tablero después de guardar los cambios
            navigate(`/board/${boardId}`);
        } catch (err) {
            console.error("Error al editar el tablero:", err);  // Manejo de errores al enviar la solicitud
        }
    };

    // Mostrar un mensaje de carga mientras se obtiene la información
    if (loading) return <p>Cargando formulario de edición...</p>;

    // Mostrar un mensaje de error si no se puede cargar el tablero
    if (error) return <p>Error al cargar el tablero para editar.</p>;

    return (
        <div className={styles['edit-board-container']}>
            <h2>Editar Tablero</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        value={title}  // El valor del campo se vincula al estado
                        onChange={(e) => setTitle(e.target.value)}  // Actualizar el estado cuando el valor cambie
                        required  // El título es un campo obligatorio
                    />
                </div>
                <div>
                    <label>Descripción</label>
                    <textarea
                        value={description}  // El valor del textarea se vincula al estado
                        onChange={(e) => setDescription(e.target.value)}  // Actualizar el estado cuando el valor cambie
                    />
                </div>
                <button type="submit">Guardar Cambios</button>  {/* Botón para enviar el formulario */}
            </form>
        </div>
    );
};

export default EditBoardPage;
