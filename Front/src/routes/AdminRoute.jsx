/*---------------------------------------------------------------*\
 * ProtectedRoute.jsx
 * 
 * Ruta protegida que solo permite el acceso a usuarios administradores.
 * 
 * Funcionalidad principal:
 * - Muestra un mensaje de carga si la autenticación aún está procesándose.
 * - Redirige a la página principal si el usuario no es administrador.
 * - Renderiza las rutas hijas si el usuario está autorizado.
 * 
\*---------------------------------------------------------------*/

import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from "@/components/Loader.jsx"

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Mostrar mensaje de carga mientras se verifica la autenticación
  if (loading) return <Loader />;

  // Verificar si el usuario no es admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Renderizar rutas hijas si está autorizado
  return <Outlet />;
};

export default ProtectedRoute;
