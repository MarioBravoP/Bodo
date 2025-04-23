/*---------------------------------------------------------------*\
 * ProtectedRoute.jsx
 * 
 * Componente para proteger rutas que solo pueden acceder usuarios
 * autenticados. Redirige al login si no hay usuario.
\*---------------------------------------------------------------*/

import Loader from '@/components/Loader';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;
