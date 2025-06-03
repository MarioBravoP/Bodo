# 📋 Bōdo - Gestión de Tareas y Tableros

Link: https://bodo-front.vercel.app/

Registro deshabilitado. Si quieres probar la App utiliza las siguientes credenciales:
Email: usuario3@app.es
Password: usuario

Trabajo realizado como proyecto final para el Máster en Desarrollo Web de CEI.

Bōdo es una aplicación web para la organización de tareas en equipo a través de tableros colaborativos. Incluye autenticación de usuarios, solicitudes de amistad y gestión de proyectos en tiempo real.

La idea del proyecto es que sea una aplicación simple, pero fácilmente ampliable y escalable. Con una base ya asentada en la que sea sencillo añadir funcionalidades.

## 🚀 Tecnologías principales

- **Frontend:** React, Vite
- **Backend:** Node.js, ExpressJS, MongoDB, Mongoose
- **Otros:** Cloudinary (gestión de imágenes), JWT (autenticación), Vercel (deploy)

## 📋 Funcionalidades principales

- **Autenticación de usuarios:** Registro, login seguro mediante JWT.

- **Gestión de perfil**: Actualización de nombre y foto de perfil (con almacenamiento en Cloudinary).

- **Amistades**: Enviar, aceptar o rechazar solicitudes de amistad.

- **Tableros colaborativos**: Crear tableros propios y añadir como miembros a tus contactos.

- **Gestión de tareas**: Crear, editar, mover y eliminar tareas dentro de tableros. Con organización por estado de la tarea.

- **Landing Page**: Acceder a los tableros de los que formas parte. 

- **Administración**: Panel de administración para gestionar usuarios.


## 📁 Estructura del repositorio

```bash
/bodo
  /frontend    # Aplicación cliente (React + Vite)
  /backend     # API RESTful (ExpressJS + MongoDB)
  README.md    # Información general del proyecto