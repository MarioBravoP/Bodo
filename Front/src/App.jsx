/*---------------------------------------------------------------*\
 * App.jsx
 * 
 * Componente principal que configura las rutas y el layout global
 * de la aplicación.
 * 
 * Funcionalidad principal:
 * - Muestra un spinner de carga mientras se obtiene el estado de autenticación.
 * - Configura las rutas usando `BrowserRouter` y `AppRoutes`.
 * - Envuelve las rutas en un layout común que se usa para todas las páginas.
 * - Muestra el banner de cookies al final de la aplicación.
 * 
 * Hooks y Componentes:
 * - `useAuth`: Proporciona el estado de carga y autenticación del usuario.
 * - `Spinner`: Componente que muestra el indicador de carga mientras se espera.
 * - `AppRoutes`: Maneja todas las rutas dentro de la aplicación.
 * - `CookieBanner`: Muestra un banner de cookies en la parte inferior.
 * - `Layout`: Componente que envuelve las rutas y proporciona la estructura común.
 * 
\*---------------------------------------------------------------*/

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { useAuth } from './contexts/AuthContext';
import CookieBanner from './components/CookieBanner';
import Layout from './layouts/Layout';

function App() {
  const { loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
      <CookieBanner />
    </Router>
  );
}

export default App;
