# 📦 Backend de Bodo - API RESTful

La API está desarrollada con **Node.js** y **ExpressJS**, utilizando **MongoDB** como base de datos.

## 🚀 Tecnologías utilizadas

- Node.js
- ExpressJS
- MongoDB + Mongoose
- JSON Web Tokens (JWT) para autenticación
- Cloudinary para almacenamiento de imágenes
- Winston para la gestión de logs
- CORS para gestión de políticas de acceso

## 📋 Funcionalidades principales

- Autenticación de usuarios mediante JWT (registro, login, logout).
- Gestión de perfiles: actualización de nombre y foto.
- Sistema de amistad: solicitudes, aceptación y rechazo.
- Gestión de tableros colaborativos.
- CRUD de tareas dentro de los tableros.
- Administración de usuarios.
- Manejo centralizado de errores a través de middleware.
- Logs de eventos y errores.

## Arhivo ENV

Es necesario crear un archivo .env con las siguiente variables:
- MONGO_URI=tu_uri_de_mongodb
- JWT_SECRET=tu_secreto
- CLOUDINARY_CLOUD_NAME=tu_nombre
- CLOUDINARY_API_KEY=tu_api_key
- CLOUDINARY_API_SECRET=tu_api_secret
- PORT=puerto_para_server