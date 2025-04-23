/*---------------------------------------------------------------*\
 * AppRoutes.jsx
 * 
 * Definición de todas las rutas principales de la aplicación.
 * Incluye rutas públicas, protegidas para usuarios autenticados
 * y rutas exclusivas para administradores.
 * 
 * También se incluye el banner de cookies.
\*---------------------------------------------------------------*/

import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ROUTES from '@/const/routes'; // Importar las rutas desde el archivo de configuración
import * as LAZY_IMPORTS from '@/const/lazyImports'; // Importar las rutas lazy centralizadas

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute.jsx';
import CookieBanner from '@/components/CookieBanner.jsx';
import Loader from "@/components/Loader.jsx";
import NotFoundPage from "@/pages/NotFoundPage.jsx"

const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path={ROUTES.HOME} element={<LAZY_IMPORTS.LANDING_PAGE />} />
          <Route path={ROUTES.LOGIN} element={<LAZY_IMPORTS.LOGIN_PAGE />} />
          <Route path={ROUTES.REGISTER} element={<LAZY_IMPORTS.REGISTER_PAGE />} />

          {/* Rutas protegidas (requieren usuario autenticado) */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.PROFILE} element={<LAZY_IMPORTS.PROFILE_PAGE />} />
            <Route path={ROUTES.NEW_BOARD} element={<LAZY_IMPORTS.BOARD_FORM_PAGE />} />
            <Route path={ROUTES.BOARD} element={<LAZY_IMPORTS.BOARD_PAGE />} />
            <Route path={ROUTES.EDIT_BOARD} element={<LAZY_IMPORTS.EDIT_BOARD_PAGE />} />
            <Route path={ROUTES.CREATE_TASK} element={<LAZY_IMPORTS.TASK_FORM_PAGE />} />
            <Route path={ROUTES.PROFILE_EDIT} element={<LAZY_IMPORTS.PROFILE_EDIT_PAGE />} />
          </Route>

          {/* Rutas exclusivas para administradores */}
          <Route element={<AdminRoute />}>
            <Route path={ROUTES.ADMIN_SITE} element={<LAZY_IMPORTS.ADMIN_PAGE />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Banner de Cookies */}
      <CookieBanner />
    </>
  );
};

export default AppRoutes;
