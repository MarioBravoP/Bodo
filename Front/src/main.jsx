/*---------------------------------------------------------------*\
 * index.jsx
 * 
 * Punto de entrada principal para la aplicación.
 * 
 * Funcionalidad principal:
 * - Configura el contexto de autenticación usando `AuthProvider`.
 * - Muestra un spinner mientras se obtiene el estado de autenticación.
 * - Renderiza la aplicación envolviéndola en el `AuthGate` para garantizar
 *   que solo se renderiza después de que el estado de autenticación esté listo.
 * 
 * Componentes principales:
 * - `AuthProvider`: Proporciona el estado de autenticación y funciones relacionadas a toda la aplicación.
 * - `AuthGate`: Componente que muestra un spinner mientras se obtiene el estado de autenticación.
 * - `App`: Componente principal que maneja las rutas y la estructura global de la aplicación.
 * 
\*---------------------------------------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/global.css';
import Loader from '@/components/Loader';

// Componente para manejar la carga de autenticación antes de renderizar la app
const AuthGate = ({ children }) => {
  const { loading } = useAuth();

  // Mostrar el spinner mientras se obtiene el estado de autenticación
  if (loading) {
    return (
      <Loader></Loader>
    );
  }

  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthGate>
        <App />
      </AuthGate>
    </AuthProvider>
  </React.StrictMode>
);
