/*---------------------------------------------------------------*\
 * LandingPage.jsx
 * 
 * Página principal de la aplicación. Muestra información introductoria
 * sobre la aplicación, así como los tableros del usuario si está autenticado.
 * 
 * Funcionalidad:
 * - Muestra una sección introductoria para los usuarios no autenticados.
 * - Muestra los tableros del usuario si está autenticado.
 * - Permite la creación de un nuevo tablero o la redirección a la página de login/registro.
 * 
 * Hooks y Componentes:
 * - `useEffect`: Para cargar los tableros si el usuario está autenticado.
 * - `useRef`: Para manejar la referencia al contenedor de notificaciones (Toast).
 * - `useAuth`: Contexto que provee los datos del usuario autenticado.
 * - `useFetch`: Hook personalizado para obtener datos de la API.
 * - `Link`: Para la navegación entre rutas.
 * - `BoardCard`: Componente para mostrar información resumida de los tableros.
 * - `ToastContainer`: Componente que muestra notificaciones al usuario.
 * 
 *---------------------------------------------------------------*/

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import useFetch from '@/hooks/useFetch';
import ToastContainer from '@/components/ToastContainer';
import styles from './LandingPage.module.css';
import BoardCard from '@/components/BoardCard';

const LandingPage = () => {
  // Obtener el usuario autenticado y el estado de carga de la autenticación
  const { user, loading: authLoading } = useAuth();

  // Obtener los tableros del usuario y el estado de carga de los tableros
  const { data: boards, fetchData, loading: boardsLoading } = useFetch();

  // Referencia para el contenedor de notificaciones (Toast)
  const toastRef = useRef(null);

  // Efecto para cargar los tableros del usuario después de que se haya autenticado
  useEffect(() => {
    if (!authLoading && user) {
      fetchData('/api/board');
    }
  }, [authLoading, user]);

  return (
    <>
      <main className={styles.landingPage}>

        {/* Hero Section */}
        <div className={styles.landingPage__hero}>
          <h1 className={styles.landingPage__heroTitle}>Gestor Bōdo</h1>
          <p className={styles.landingPage__heroDescription}><span className={styles['italic-animated']}>Sencillo y eficiente,</span> porque no necesitas comerte el coco para empezar la semana.</p>
          <div className={styles.landingPage__heroImage}>
            <img src="/assets/flechas.svg" alt="Organiza tus tareas"/>
          </div>
        </div>

        {/* Descripción de la Aplicación */}
        <section className={styles.landingPage__features}>
          <div className={styles.landingPage__featuresImage}>
            <img src="/assets/ilu-conect.svg" alt="Organiza tus tareas" />
          </div>
          <div className={styles.landingPage__featuresContent}>
            <h2 className={styles.landingPage__featuresTitle}>¿Qué puedes hacer en Bōdo?</h2>
            <p className={styles.landingPage__featuresText}>
              Crea tableros personalizados para tus proyectos, asigna tareas, define prioridades y
              colabora en tiempo real con tu equipo. Nuestra plataforma te permite mantener el control
              de tus objetivos, organizar tus ideas de forma visual y optimizar tu productividad
              semana tras semana. ¡Todo en un entorno sencillo e intuitivo!
            </p>
          </div>
        </section>

        {/* Sección dinámica con tableros del usuario */}
        <section className={styles.landingPage__dynamicSection}>
          {authLoading ? (
            <p className={styles.landingPage__loadingText}>Cargando...</p>  // Mostrar cuando se está cargando el estado de autenticación
          ) : user ? ( 
            <div className={styles.landingPage__boardsSection}>
              <h2 className={styles.landingPage__boardsSectionTitle}>Mis Tableros</h2>
              {boardsLoading ? (
                <p className={styles.landingPage__loadingText}>Cargando tableros...</p>  // Mostrar cuando se están cargando los tableros
              ) : boards && boards.length > 0 ? (  // Si hay tableros disponibles
                <ul className={styles.landingPage__boardList}>
                  {boards.map((board) => (
                    <BoardCard key={board._id} board={board} />  // Mostrar una tarjeta por cada tablero
                  ))}
                </ul>
              ) : (
                <div className={styles.landingPage__noBoards}>
                  <p className={styles.landingPage__noBoardsText}>No tienes tableros todavía. ¡Crea el primero!</p>
                </div>
              )}
              <Link to="/new_board" className={styles.landingPage__createButton}>
                Crear Tablero  {/* Botón para crear un nuevo tablero */}
              </Link>
            </div>
          ) : (  // Si el usuario no está autenticado
            <div className={styles.landingPage__notLoggedIn}>
              <h2 className={styles.landingPage__notLoggedInTitle}>Si es tu primera vez aquí...</h2>
              <p className={styles.landingPage__notLoggedInText}>Crea una cuenta y empieza a organizarte en minutos.</p>
              <div className={styles.landingPage__buttons}>
                <Link to="/login" className={styles.landingPage__primaryButton}>
                  Iniciar Sesión  {/* Botón para iniciar sesión */}
                </Link>
                <Link to="/register" className={styles.landingPage__secondaryButton}>
                  Registrarse  {/* Botón para registrarse */}
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <ToastContainer ref={toastRef} />  {/* Componente para mostrar notificaciones */}
    </>
  );
};

export default LandingPage;
