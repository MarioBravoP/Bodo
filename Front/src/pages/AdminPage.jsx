/*---------------------------------------------------------------*\
 * AdminPage.jsx
 * 
 * Página del panel de administración para gestionar usuarios.
 * - Permite ver una lista de usuarios con información básica (nombre, correo electrónico).
 * - Ofrece la opción de eliminar usuarios con una confirmación previa.
 * - Pagina la lista de usuarios mostrando un número determinado de usuarios por página.
 * 
 * Propósito:
 * - Mostrar una interfaz de administración para gestionar usuarios.
 * - Facilitar la eliminación de usuarios con una confirmación visual para evitar eliminaciones accidentales.
 * 
 * Hooks usados:
 * - `useState`: Para manejar el estado de los usuarios, la página actual y la carga.
 * - `useEffect`: Para cargar los usuarios al inicializar el componente y ajustar la paginación si es necesario.
 * - `useRef`: Para manejar la referencia al componente `ToastContainer` y mostrar notificaciones.
 * 
 * Funcionamiento:
 * - Al cargar la página, se realiza una solicitud a la API para obtener la lista de usuarios.
 * - Los usuarios se muestran en una lista paginada, mostrando 5 usuarios por página.
 * - Se ofrece un botón para eliminar usuarios, con una confirmación previa a la eliminación.
 * - Se muestran notificaciones de éxito o error mediante el componente `ToastContainer`.
 * 
 *--------------------------------------------------------------*/

import { useEffect, useState, useRef } from "react";
import styles from "./AdminPage.module.css";
import useFetch from "@/hooks/useFetch";
import ToastContainer from "@/components/ToastContainer";

const AdminDashboard = () => {
  const { fetchData, loading } = useFetch();  // Usamos nuestro hook de fetch
  const [users, setUsers] = useState([]);  // Estado para la lista de usuarios
  const [currentPage, setCurrentPage] = useState(1);  // Estado para la página actual
  const usersPerPage = 5;  // Número de usuarios a mostrar por página
  const toastRef = useRef();  // Referencia al ToastContainer para mostrar notificaciones

  // Cargar usuarios al inicializar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Ajustar la página actual si el número total de páginas cambia
  useEffect(() => {
    const totalPages = Math.ceil(users.length / usersPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [users, currentPage]);

  // Función para obtener la lista de usuarios
  const fetchUsers = async () => {
    try {
      const data = await fetchData('/api/user/admin', 'GET', null, {
        Authorization: `Bearer ${localStorage.getItem('token')}`,  // Obtener el token desde el localStorage
      });
      if (data) {
        const sortedUsers = data.sort((a, b) => a.name.localeCompare(b.name));  // Ordenar usuarios por nombre
        setUsers(sortedUsers);  // Guardar los usuarios ordenados
      }
    } catch (error) {
      toastRef.current?.addToast("Error al cargar usuarios", "error");  // Mostrar error si no se puede obtener la lista
    }
  };

  // Confirmar la eliminación de un usuario
  const confirmDeleteUser = (userId) => {
    toastRef.current?.addToast(
      "¿Estás seguro que deseas eliminar este usuario?",
      "confirm",
      async (confirmed) => {
        if (confirmed) {
          try {
            await fetchData(`/api/user/admin/${userId}`, 'DELETE', null, {
              Authorization: `Bearer ${localStorage.getItem('token')}`,  // Autorizar la solicitud con el token
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));  // Eliminar el usuario de la lista
            toastRef.current?.addToast("Usuario eliminado correctamente", "success");  // Notificar éxito
          } catch (error) {
            toastRef.current?.addToast("Error al eliminar usuario", "error");  // Notificar error en la eliminación
          }
        }
      }
    );
  };

  // Paginación: Calcular los índices de los usuarios a mostrar
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);  // Obtener los usuarios para la página actual

  const totalPages = Math.ceil(users.length / usersPerPage);  // Calcular el número total de páginas

  // Funciones para navegar entre las páginas
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.dashboard}>
      {/* Componente para mostrar notificaciones */}
      <ToastContainer ref={toastRef} />

      <h2 className={styles.dashboard__title}>Panel de Administración</h2>

      {/* Mostrar mensaje de carga mientras se obtienen los usuarios */}
      {loading ? (
        <p className={styles.dashboard__loading}>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p className={styles['dashboard__no-users']}>No hay usuarios disponibles.</p>
      ) : (
        <>
          {/* Lista de usuarios */}
          <ul className={styles['dashboard__user-list']}>
            {currentUsers.map(user => (
              <li key={user._id} className={styles['dashboard__user-item']}>
                <img
                  src={user.profileImage || "/images/default-profile.png"}  // Imagen de perfil del usuario
                  alt={user.name}
                  className={styles['dashboard__profile-image']}
                />
                <div className={styles['dashboard__user-info']}>
                  <span className={styles['dashboard__user-name']}>{user.name}</span>
                  <span className={styles['dashboard__user-email']}>{user.email}</span>
                </div>
                <button
                  className={styles['dashboard__delete-button']}
                  onClick={() => confirmDeleteUser(user._id)}  // Llamar a la función de confirmación de eliminación
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          {/* Paginación de usuarios */}
          <div className={styles.dashboard__pagination}>
            <button onClick={prevPage} disabled={currentPage === 1} className={styles['dashboard__pagination-button']}>
              Anterior
            </button>
            <span className={styles['dashboard__pagination-span']}>Página {currentPage} de {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages} className={styles['dashboard__pagination-button']}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
