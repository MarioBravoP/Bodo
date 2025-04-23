/*---------------------------------------------------------------*\
 * EditBoardPage.jsx
 * 
 * Página de edición de un tablero. Permite modificar el título, la descripción
 * y los miembros de un tablero existente.
 * 
 * Funcionalidad:
 * - Carga los datos del tablero a editar usando el ID de la URL.
 * - Permite modificar el título y la descripción del tablero.
 * - Permite añadir o eliminar miembros del tablero seleccionando de una lista de contactos.
 * - Envía los cambios al backend para actualizar el tablero.
 * - Muestra notificaciones en caso de errores durante la carga o el envío de datos.
 * 
 * Hooks y Componentes:
 * - `useEffect`: Para cargar los datos del tablero y los contactos disponibles para añadir.
 * - `useState`: Para gestionar los valores del formulario, como título, descripción y miembros seleccionados.
 * - `useParams`: Para obtener el `boardId` de la URL y cargar el tablero correspondiente.
 * - `useNavigate`: Para redirigir al usuario después de guardar los cambios.
 * - `useFetch`: Hook personalizado para realizar solicitudes a la API.
 * - `ToastContainer`: Componente para mostrar notificaciones al usuario.
 * 
 *---------------------------------------------------------------*/

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import styles from './EditBoardPage.module.css';
import ToastContainer from '@/components/ToastContainer';

const EditBoardPage = () => {
    // Obtener el ID del tablero desde los parámetros de la URL
    const { boardId } = useParams();
    
    // Obtener los datos, error y estado de carga para las solicitudes a la API
    const { data, error, loading, fetchData } = useFetch();
    
    // Función para redirigir después de guardar los cambios
    const navigate = useNavigate();
    
    // Referencia para el contenedor de notificaciones (Toast)
    const toastRef = useRef();

    // Estado para manejar los valores del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentMembers, setCurrentMembers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Efecto para cargar el tablero y los contactos disponibles
    useEffect(() => {
        if (boardId) {
            fetchData(`/api/board/${boardId}`, 'GET')  // Cargar los datos del tablero
                .then((response) => {
                    if (response) {
                        setTitle(response.board.title);  // Establecer el título
                        setDescription(response.board.description || '');  // Establecer la descripción
                        setCurrentMembers(response.board.members || []);  // Establecer los miembros actuales
                    }
                })
                .catch((err) => console.error("Error al cargar el tablero:", err));
        }

        // Función para cargar los contactos disponibles para añadir
        const fetchContacts = async () => {
            try {
                const result = await fetchData('/api/user/contacts', 'GET');
                if (Array.isArray(result) && result.length > 0) {
                    setContacts(result);  // Establecer los contactos disponibles
                }
            } catch (err) {
                console.error("Error al cargar contactos:", err);
                toastRef.current?.addToast('Error al cargar contactos.', 'error');  // Mostrar notificación de error
            }
        };

        fetchContacts();
    }, [boardId]);  // Dependencia de `boardId` para recargar los datos al cambiar el ID del tablero

    // Manejo del envío del formulario para actualizar el tablero
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevenir comportamiento por defecto del formulario

        // Crear el objeto con los datos actualizados del tablero
        const updatedBoard = {
            title,
            description,
            members: [...currentMembers, ...selectedMembers],  // Añadir miembros seleccionados
        };

        try {
            // Enviar los datos actualizados al backend para guardarlos
            await fetchData(`/api/board/${boardId}`, 'PUT', updatedBoard);
            navigate(`/board/${boardId}`);  // Redirigir al usuario al tablero después de guardar los cambios
        } catch (err) {
            console.error("Error al editar el tablero:", err);
        }
    };

    // Manejo de la selección y deselección de miembros
    const handleSelectMember = (memberId) => {
        setSelectedMembers(prevMembers => {
            // Si el miembro ya está seleccionado, lo eliminamos, si no, lo añadimos
            if (prevMembers.includes(memberId)) {
                return prevMembers.filter(id => id !== memberId);
            } else {
                return [...prevMembers, memberId];
            }
        });
    };

    // Mostrar mensaje de carga mientras los datos están siendo procesados
    if (loading) return <p>Cargando formulario de edición...</p>;

    // Mostrar mensaje de error si ocurrió un problema al cargar los datos
    if (error) return <p>Error al cargar el tablero para editar.</p>;

    // Filtrar los contactos disponibles que no sean miembros actuales del tablero
    const availableContacts = contacts.filter(contact =>
        !currentMembers.some(member => member._id === contact._id)
    );

    return (
        <div className={styles['edit-board-container']}>
            <h2 className={styles['edit-board-container__title']}>Editar Tablero</h2>
            <form onSubmit={handleSubmit} className={styles['edit-board-form']}>
                {/* Campo de Título */}
                <div className={styles['edit-board-form__group']}>
                    <label className={styles['edit-board-form__label']}>Título</label>
                    <input
                        type="text"
                        className={styles['edit-board-form__input']}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de Descripción */}
                <div className={styles['edit-board-form__group']}>
                    <label className={styles['edit-board-form__label']}>Descripción</label>
                    <textarea
                        className={styles['edit-board-form__textarea']}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Selección de Miembros */}
                <div className={styles['edit-board-form__group']}>
                    <label className={styles['edit-board-form__label']}>Selecciona miembros para añadir</label>
                    {availableContacts.length === 0 ? (
                        <p className={styles['edit-board-form__no-contacts']}>No hay contactos disponibles para añadir.</p>
                    ) : (
                        <div className={styles['edit-board-form__members-list']}>
                            {availableContacts.map(contact => (
                                <div key={contact._id} className={styles['edit-board-form__member-item']}>
                                    <input
                                        type="checkbox"
                                        className={styles['edit-board-form__checkbox']}
                                        id={contact._id}
                                        checked={selectedMembers.includes(contact._id)}
                                        onChange={() => handleSelectMember(contact._id)}
                                    />
                                    <label htmlFor={contact._id} className={styles['edit-board-form__member-label']}>
                                        <span className={styles['edit-board-form__custom-checkbox']}></span>
                                        {contact.name} ({contact.email})
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botón para enviar el formulario */}
                <button type="submit" className={styles['edit-board-form__button']}>Guardar Cambios</button>
            </form>

            {/* Componente de notificaciones */}
            <ToastContainer ref={toastRef} />
        </div>
    );
};

export default EditBoardPage;
