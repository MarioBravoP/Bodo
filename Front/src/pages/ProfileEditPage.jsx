/*---------------------------------------------------------------*\
 * ProfileEditPage.jsx
 * 
 * Página de edición de perfil de usuario. Permite al usuario actualizar
 * su nombre y cambiar su foto de perfil.
 * 
 * Funcionalidad:
 * - Cargar la información actual del perfil al entrar en la página.
 * - Permitir la actualización del nombre del usuario.
 * - Permitir la carga y previsualización de una nueva imagen de perfil.
 * - Guardar los cambios enviándolos al servidor.
 * - Mostrar notificaciones de éxito o error mediante ToastContainer.
 * 
 * Hooks y Componentes:
 * - `useState`: Para manejar el estado del formulario y la imagen.
 * - `useEffect`: Para cargar los datos del perfil al montar el componente.
 * - `useRef`: Para manejar la referencia al contenedor de notificaciones.
 * - `useFetch`: Hook personalizado para realizar peticiones a la API.
 * - `ToastContainer`: Componente para mostrar notificaciones.
 * 
 * Notas:
 * - No es necesario usar `method`, `action` ni `enctype` en el formulario.
 * - Las imágenes se convierten a base64 antes de enviarse.
\*---------------------------------------------------------------*/

import { useState, useEffect, useRef } from 'react';
import useFetch from '@/hooks/useFetch';
import ToastContainer from '@/components/ToastContainer';
import styles from './ProfileEditPage.module.css';

const ProfileEditPage = () => {
    const { data, fetchData, loading, error } = useFetch();
    const toastRef = useRef(null);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profileImage: '',
    });

    const [newImageFile, setNewImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    // Cargar datos del perfil del usuario al montar el componente
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = await fetchData('/api/user/profile');
                setUserData(user);
                setPreviewImage(user.profileImage);
            } catch (err) {
                console.error('Error fetching profile:', err);
                toastRef.current?.addToast('Error al cargar perfil', 'error');
            }
        };

        fetchUserProfile();
    }, []);

    // Manejar cambios en los inputs de texto
    const handleInputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Manejar la selección de una nueva imagen y generar una previsualización
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toastRef.current?.addToast('El archivo excede el tamaño máximo de 5MB', 'error');
                return;
            }
            setNewImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Enviar la actualización de perfil al servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let base64Image = null;

            if (newImageFile) {
                base64Image = await toBase64(newImageFile);
            }

            await fetchData('/api/user/update', 'PUT', {
                name: userData.name,
                profileImage: base64Image,
            });

            toastRef.current?.addToast('Perfil actualizado correctamente', 'success');
        } catch (err) {
            console.error('Error actualizando perfil:', err);
            toastRef.current?.addToast('Error al actualizar perfil', 'error');
        }
    };

    // Función auxiliar para convertir un archivo a base64
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className={styles['profile-edit']}>
            <ToastContainer ref={toastRef} />

            {/* Mostrar estado de carga o error */}
            {loading && <p className={styles['profile-edit__message']}>Cargando...</p>}
            {error && <p className={`${styles['profile-edit__message']} ${styles['profile-edit__message--error']}`}>{error}</p>}

            {/* Formulario de edición de perfil */}
            <form onSubmit={handleSubmit} className={styles['profile-edit__form']}>

                {/* Previsualización de la imagen de perfil */}
                <div className={styles['profile-edit__image-wrapper']}>
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Vista previa del perfil"
                            className={styles['profile-edit__image']}
                        />
                    ) : (
                        <div className={styles['profile-edit__placeholder']}>Sin imagen</div>
                    )}
                </div>

                {/* Input para subir nueva foto */}
                <div className={styles['profile-edit__group']}>
                    <label className={styles['profile-edit__label']}>
                        Cambiar Foto
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles['profile-edit__input-file']}
                        />
                    </label>
                </div>

                {/* Input de nombre editable */}
                <div className={styles['profile-edit__group']}>
                    <label className={styles['profile-edit__label']}>
                        Nombre
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className={styles['profile-edit__input']}
                            required
                        />
                    </label>
                </div>

                {/* Input de email solo lectura */}
                <div className={styles['profile-edit__group']}>
                    <label className={styles['profile-edit__label']}>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            readOnly
                            disabled
                            className={styles['profile-edit__input']}
                        />
                    </label>
                </div>

                {/* Botón para guardar cambios */}
                <button
                    type="submit"
                    className={styles['profile-edit__button']}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
};

export default ProfileEditPage;
