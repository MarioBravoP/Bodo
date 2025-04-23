/*---------------------------------------------------------------*\
 * Header.jsx
 * 
 * Componente de cabecera principal de la aplicación.
 * - Muestra el logo y la navegación principal.
 * - Gestiona login/registro para usuarios no logueados.
 * - Muestra avatar y dropdown con acciones para usuarios autenticados.
 * - Responsive: incluye botón de menú para móviles.
 * - Maneja eventos de apertura/cierre de menús y dropdowns de forma accesible.
 * 
 * Hooks usados:
 * - useAuth: para obtener usuario actual y logout.
 * - useNavigate: para navegación programática.
 * - useState, useEffect, useRef: para manejar estados y eventos de interacción.
 *--------------------------------------------------------------*/

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './Header.module.css';
import ROUTES from '@/const/routes';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeDropdown();
    setIsMenuOpen(false);
  };

  // Alterna el estado de apertura del dropdown de perfil
  const toggleDropdown = () => {
    isDropdownOpen ? closeDropdown() : setIsDropdownOpen(true);
  };

  // Alterna la apertura/cierre del menú hamburguesa en móviles
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cierra el dropdown de perfil aplicando animación
  const closeDropdown = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleOptionClick = () => {
    closeDropdown();
    setIsMenuOpen(false);
  };

  // Cierra el dropdown si el usuario hace clic fuera de él
  const handleClickOutside = (e) => {
    if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      closeDropdown();
    }
  };

  // Se suscribe al evento global para detectar clics externos
  useEffect(() => {
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Link to={ROUTES.HOME} className={styles.header__logo}>
          <img
            src="/assets/Bodo%20logo.svg"
            alt="Bodo Logo - Inicio"
            className={styles.header__logoImage}
            loading="lazy"
          />
        </Link>

        <nav className={styles.header__nav}>
          {!user ? (
            <>
              <button
                className={styles.header__menuButton}
                onPointerDown={toggleMenu}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>

              <div className={`${styles.header__navLinks} ${isMenuOpen ? styles['header__navLinks--open'] : ''}`}>
                <Link to={ROUTES.LOGIN} onClick={handleOptionClick} className={styles.header__navLink}>
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} onClick={handleOptionClick} className={styles.header__navLink}>
                  Registro
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.header__profile} ref={dropdownRef}>
              <img
                src={user.profileImage || '/images/default-profile.png'}
                alt={user.name}
                className={styles.header__profileImage}
                onPointerDown={toggleDropdown}
              />
              {(isDropdownOpen || isClosing) && (
                <div className={`${styles.header__dropdown} ${isClosing ? styles['header__dropdown--closing'] : ''}`}>
                  {user.role === "admin" && (
                    <Link to={ROUTES.ADMIN_SITE} onClick={handleOptionClick} className={styles.header__dropdownItem}>
                      Administrar
                    </Link>
                  )}
                  <Link to={ROUTES.PROFILE} onClick={handleOptionClick} className={styles.header__dropdownItem}>
                    Mi Perfil
                  </Link>
                  <Link to={ROUTES.NEW_BOARD} onClick={handleOptionClick} className={styles.header__dropdownItem}>
                    Nuevo Tablero
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.header__dropdownItemButton}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
