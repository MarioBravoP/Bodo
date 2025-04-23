import { lazy } from 'react';

// Rutas principales de las páginas de la aplicación
export const LANDING_PAGE = lazy(() => import('@/pages/LandingPage.jsx'));
export const LOGIN_PAGE = lazy(() => import('@/pages/LoginPage.jsx'));
export const REGISTER_PAGE = lazy(() => import('@/pages/RegisterPage.jsx'));
export const PROFILE_PAGE = lazy(() => import('@/pages/ProfilePage.jsx'));
export const BOARD_FORM_PAGE = lazy(() => import('@/pages/BoardFormPage.jsx'));
export const BOARD_PAGE = lazy(() => import('@/pages/BoardPage.jsx'));
export const EDIT_BOARD_PAGE = lazy(() => import('@/pages/EditBoardPage.jsx'));
export const TASK_FORM_PAGE = lazy(() => import('@/pages/TaskFormPage.jsx'));
export const PROFILE_EDIT_PAGE = lazy(() => import('@/pages/ProfileEditPage.jsx'));
export const ADMIN_PAGE = lazy(() => import('@/pages/AdminPage.jsx'));
