/*---------------------------------------------------------------*\
 * ProfilePage.jsx
 * 
 * Página de perfil de usuario.
 * Permite visualizar la información del usuario, enviar solicitudes de amistad,
 * aceptar o rechazar solicitudes recibidas y gestionar la lista de contactos.
 * 
 * Funcionalidad principal:
 * - Mostrar información básica del perfil (nombre, email, foto).
 * - Enviar solicitudes de amistad mediante email.
 * - Gestionar solicitudes pendientes (aceptar o rechazar).
 * - Mostrar lista de contactos aceptados.
 * 
 * Hooks y Componentes:
 * - `useAuth`: Obtener usuario actual.
 * - `useFetch`: Realizar peticiones API (perfil, solicitudes, contactos).
 * - `ToastContainer`: Mostrar mensajes de notificación.
 * 
\*---------------------------------------------------------------*/

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import useFetch from '@/hooks/useFetch';
import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import ToastContainer from '@/components/ToastContainer';
import styles from './Profile.module.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const { fetchData: sendRequest } = useFetch();
  const { fetchData: updateProfile } = useFetch();

  const [newContactEmail, setNewContactEmail] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [fadingRequestIds, setFadingRequestIds] = useState([]);

  const toastContainerRef = useRef(null);

  // Cargar datos del perfil cuando el usuario esté disponible
  useEffect(() => {
    if (user && !profileData) {
      fetchData('/api/user/profile', 'GET')
        .then(response => {
          setProfileData(response);
          setPendingRequests(response.pendingRequests || []);
          setContacts(response.contacts || []);
        })
        .catch(error => {
          console.error("Error al obtener el perfil:", error);
        });
    }
  }, [user, profileData, fetchData]);

  // Mostrar mensaje tipo toast
  const showToast = (message, type) => {
    if (toastContainerRef.current) {
      toastContainerRef.current.addToast(message, type);
    }
  };

  // Enviar solicitud de amistad
  const handleSendRequest = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recarga de página)

    if (!newContactEmail.trim()) {
      showToast('Por favor introduce un correo válido', 'error');
      return;
    }

    if (newContactEmail.trim() === user.email) {
      showToast('No puedes enviarte una solicitud a ti mismo', 'error');
      return;
    }

    try {
      await sendRequest('/api/user/send-friend-request', 'POST', { email: newContactEmail });
      showToast('Solicitud enviada correctamente', 'success');
      setNewContactEmail('');
    } catch (err) {
      showToast('No se pudo enviar la solicitud', 'error');
    }
  };

  // Aceptar solicitud de amistad
  const handleAccept = async (requestId) => {
    setFadingRequestIds(prev => [...prev, requestId]);
    setTimeout(async () => {
      try {
        const response = await updateProfile('/api/user/accept-friend-request', 'POST', { requestId });
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        if (response?.newContact) {
          setContacts(prev => [...prev, response.newContact]);
        }
        showToast('Solicitud aceptada', 'success');
      } catch (err) {
        showToast('Error al aceptar solicitud', 'error');
      }
    }, 400);
  };

  // Rechazar solicitud de amistad
  const handleReject = async (requestId) => {
    setFadingRequestIds(prev => [...prev, requestId]);
    setTimeout(async () => {
      try {
        await updateProfile('/api/user/reject-friend-request', 'POST', { requestId });
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        showToast('Solicitud rechazada', 'info');
      } catch (err) {
        showToast('Error al rechazar solicitud', 'error');
      }
    }, 400);
  };

  if (!profileData) return <p>Cargando perfil...</p>;

  return (
    <>
      <div className={styles['profile-page']}>

        {/* Tarjeta de perfil del usuario */}
        <div className={styles['profile-card']}>
          <div className={styles['profile-card__image-container']}>
            <picture>
              <source
                srcSet={profileData.profileImage || '/images/default-profile.png'}
                type="image/webp"
              />
              <img
                src={profileData.profileImage || '/images/default-profile.png'}
                alt="Imagen de perfil"
                className={styles['profile-card__image']}
              />
            </picture>
          </div>

          <h2 className={styles['profile-card__title']}>Perfil de {profileData.name}</h2>
          <p className={styles['profile-card__email']}>📧 {profileData.email}</p>

          <Link to="/profile/edit" className={styles['profile-card__link']}>
            Editar perfil
          </Link>
        </div>

        {/* Gestión de solicitudes y contactos */}
        <div className={styles['friends-management']}>

          {/* Solicitudes */}
          <div className={styles['friends-management__requests-column']}>
            <h3 className={styles['friends-management__title']}>Enviar solicitud</h3>
            <form
              onSubmit={handleSendRequest} // Manejamos el envío del formulario
              className={styles['friends-management__send-request']}
            >
              <input
                type="email"
                placeholder="Correo del usuario"
                value={newContactEmail}
                onChange={(e) => setNewContactEmail(e.target.value)}
                className={styles['friends-management__input']}
                required // Asegurarse de que no se envíe vacío
              />
              <button
                type="submit" // Especificamos que es un botón de envío del formulario
                className={styles['friends-management__button']}
              >
                Enviar solicitud
              </button>
            </form>

            <h3 className={styles['friends-management__title']}>Solicitudes pendientes</h3>
            {pendingRequests.length === 0 ? (
              <p>No tienes solicitudes pendientes.</p>
            ) : (
              <ul className={styles['friends-management__requests-list']}>
                {pendingRequests.map((req) => (
                  <li
                    key={req._id}
                    className={`${styles['friends-management__request-item']} ${fadingRequestIds.includes(req._id) ? styles['friends-management__fade-out'] : ''}`}
                  >
                    <span>{req.user?.email || 'Sin email disponible'}</span>
                    <div className={styles['friends-management__request-buttons']}>
                      <button onClick={() => handleAccept(req._id)}><FiCheck /></button>
                      <button onClick={() => handleReject(req._id)}><FiX /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contactos */}
          <div className={styles['friends-management__contacts-column']}>
            <h3 className={styles['friends-management__title']}>Mis contactos</h3>

            {contacts.length === 0 ? (
              <p>No tienes contactos aún.</p>
            ) : (
              <ul className={styles['friends-management__contacts-list']}>
                {contacts.map((contact) => (
                  <li key={contact._id} className={styles['friends-management__contact-item']}>
                    <picture className='friends-management__contact-picture'>
                      <source
                        srcSet={contact.profileImage || '/images/default-profile.png'}
                        type="image/webp"
                      />
                      <img
                        src={contact.profileImage || '/images/default-profile.png'}
                        alt={contact.name}
                        className={styles['friends-management__contact-image']}
                      />
                    </picture>

                    <div className={styles['friends-management__contact-info']}>
                      <span>{contact.name}</span>
                      <span>{contact.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>

      {/* Contenedor de notificaciones */}
      <ToastContainer ref={toastContainerRef} />
    </>
  );
};

export default ProfilePage;
