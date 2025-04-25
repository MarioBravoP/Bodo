/*---------------------------------------------------------------*\
 * CreateBoardPage.jsx
 * 
 * Página para crear un nuevo tablero. Permite al usuario ingresar un título, 
 * descripción, y seleccionar miembros de su lista de contactos para el nuevo tablero.
 * 
 * Propósito:
 * - Permitir la creación de un tablero, enviando los datos del título, descripción 
 *   y miembros seleccionados al backend.
 * - Mostrar un mensaje de éxito o error al procesar la creación.
 * - Cargar y mostrar los contactos del usuario para permitir la selección de miembros.
 * 
 * Hooks usados:
 * - `useState`: Para gestionar el estado de los campos del formulario (título, descripción, miembros seleccionados).
 * - `useEffect`: Para cargar la lista de contactos del usuario cuando se monta el componente.
 * - `useRef`: Para manejar la referencia al componente `ToastContainer` y mostrar notificaciones.
 * 
 * Funcionamiento:
 * - Los contactos se cargan al montar el componente, luego se muestran como opciones para la selección de miembros.
 * - El usuario puede seleccionar o deseleccionar los contactos para añadirlos como miembros del tablero.
 * - Al enviar el formulario, los datos se envían al backend para crear el tablero.
 * - Se muestra una notificación de éxito o error según el resultado de la operación.
 * 
 *--------------------------------------------------------------*/

import { useState, useEffect, useRef } from 'react';
import useFetch from '@/hooks/useFetch';
import styles from './BoardForm.module.css';
import ToastContainer from '@/components/ToastContainer';

const CreateBoardPage = () => {
  const [title, setTitle] = useState('');
  const maxTitleLength = 40;
  const [description, setDescription] = useState('');
  const maxDescriptionLength = 150;
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const { fetchData, loading, error } = useFetch();
  const toastRef = useRef();

  // Cargar los contactos del usuario cuando se monta el componente
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await fetchData('/api/user/contacts', 'GET');
        if (Array.isArray(result) && result.length > 0) {
          setContacts(result);
        }
      } catch (err) {
        toastRef.current?.addToast('Error al cargar contactos.', 'error');
      }
    };

    fetchContacts();
  }, []);

  // Manejar la selección de un miembro para el tablero
  const handleSelectMember = (memberId) => {
    setSelectedMembers(prevMembers => {
      if (prevMembers.includes(memberId)) {
        return prevMembers.filter(id => id !== memberId);
      } else {
        return [...prevMembers, memberId];
      }
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      if (title.length > maxTitleLength || description.length > maxDescriptionLength) {
        toastRef.current?.addToast('No se puede superar el límite de caracteres.', 'error')
      }
      // Enviar los datos del tablero al backend
      await fetchData('/api/board/create', 'POST', {
        title,
        description,
        members: selectedMembers,
      });

      // Mostrar notificación de éxito
      toastRef.current?.addToast('Tablero creado correctamente.', 'success');

      // Resetear los campos del formulario
      setTitle('');
      setDescription('');
      setSelectedMembers([]);
    } catch (err) {
      console.error(err);
      toastRef.current?.addToast('Hubo un problema al crear el tablero.', 'error'); 
    }
  };

  return (
    <>
      <div className={styles['board-form']}>
        <form onSubmit={handleSubmit} className={styles['board-form__form']}>
          <h2 className={styles['board-form__title']}>Crear nuevo tablero</h2>

          {/* Campo para ingresar el título del tablero */}
          <label className={styles['board-form__label']}>Título:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={maxTitleLength}
            className={styles['board-form__input']}
          />
          {title.length > maxTitleLength && (
            <p className="error-message">Has llegado al límite de {maxTitleLength} caracteres.</p>
          )}

          {/* Campo para ingresar la descripción del tablero */}
          <label className={styles['board-form__label']}>Descripción:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={maxDescriptionLength}
            className={styles['board-form__textarea']}
          />
          {description.length > maxDescriptionLength && (
            <p className="error-message">Has llegado al límite de {maxDescriptionLength} caracteres.</p>
          )}

          {/* Selección de miembros para el tablero */}
          <div className={styles['board-form__member-selection']}>
            <label className={styles['board-form__label']}>Selecciona los miembros:</label>
            {contacts.length === 0 ? (
              <p className={styles['board-form__no-contacts']}>No tienes contactos disponibles.</p>
            ) : (
              <div className={styles['board-form__members-list']}>
                {contacts.map(contact => (
                  <div key={contact._id} className={styles['board-form__member-item']}>
                    <input
                      type="checkbox"
                      id={contact._id}
                      checked={selectedMembers.includes(contact._id)}
                      onChange={() => handleSelectMember(contact._id)}
                      className={styles['board-form__checkbox']}
                    />
                    <label htmlFor={contact._id} className={styles['board-form__member-label']}>
                      <span className={styles['board-form__custom-checkbox']}></span>
                      {contact.name} ({contact.email})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <button type="submit" disabled={loading} className={styles['board-form__button']}>
            {loading ? 'Creando...' : 'Crear Tablero'}
          </button>

          {/* Mostrar mensaje de error si ocurre alguno */}
          {error && <p className={styles['board-form__error-message']}>{error}</p>}
        </form>
      </div>

      {/* Componente para mostrar notificaciones */}
      <ToastContainer ref={toastRef} />
    </>
  );
};

export default CreateBoardPage;
