/*---------------------------------------------------------------*\
 * cloudinaryService.js
 * 
 * Servicio para la gestión de imágenes de perfil de usuario utilizando
 * Cloudinary como proveedor de almacenamiento de imágenes.
 * 
 * Funcionalidad:
 * - Subir una nueva imagen de perfil a Cloudinary.
 * - Eliminar una imagen de perfil existente de Cloudinary.
 * 
 * Notas:
 * - Las imágenes se almacenan en la carpeta `profile_images` en Cloudinary.
 * - Al subir una imagen, se aplica una transformación para limitar su tamaño
 *   a 500x500 píxeles máximo (sin recortar la imagen).
 * - Al eliminar una imagen, se utiliza el `publicId` proporcionado por Cloudinary.
 * 
\*---------------------------------------------------------------*/

import cloudinary from "../config/cloudinary.js";

export const uploadProfileImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'profile_images',
    transformation: [
      { width: 500, height: 500, crop: 'limit' }
    ]
  });
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
};

/**
 * Elimina una imagen de perfil de Cloudinary.
 * 
 * @param {string} publicId - ID público de la imagen a eliminar.
 */
export const deleteProfileImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
