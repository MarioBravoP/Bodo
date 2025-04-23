/*---------------------------------------------------------------*\
 * boardModel.js
 * 
 * Modelo de Mongoose para la colección de tableros. Representa un 
 * tablero de trabajo donde se pueden añadir miembros, establecer 
 * un propietario y describir el tablero con un título y una descripción.
 * 
 * Funcionalidad:
 * - El título es obligatorio y tiene una longitud máxima de 40 caracteres.
 * - La descripción es opcional pero tiene una longitud máxima de 150 caracteres.
 * - El propietario (owner) es obligatorio y hace referencia a un usuario (User).
 * - Los miembros del tablero (members) son un array de usuarios que tienen acceso al tablero.
 * - Se almacenan automáticamente las fechas de creación y actualización del tablero.
 * 
 * Campos:
 * - `title`: Título del tablero, es obligatorio y tiene una longitud máxima de 40 caracteres.
 * - `description`: Descripción opcional, con una longitud máxima de 150 caracteres.
 * - `owner`: Referencia al usuario propietario del tablero, es obligatorio.
 * - `members`: Array de referencias a usuarios que son miembros del tablero, es obligatorio.
 * 
 * Hooks y Métodos:
 * - `timestamps: true`: Mongoose generará automáticamente los campos `createdAt` y `updatedAt`.
 *
 *---------------------------------------------------------------*/

import mongoose from "mongoose";

// Definición del esquema del tablero
const boardSchema = new mongoose.Schema(
  {
    // Título del tablero, obligatorio y con una longitud máxima de 40 caracteres
    title: {
      type: String,
      required: true,
      trim: true, // Elimina los espacios al principio y al final
      maxlength: [40, "El título no puede tener más de 40 caracteres"], // Validación de longitud
    },
    // Descripción del tablero, opcional y con una longitud máxima de 150 caracteres
    description: {
      type: String,
      default: "", // Valor por defecto si no se proporciona
      maxlength: [150, "La descripción no puede tener más de 150 caracteres"], // Validación de longitud
    },
    // Propietario del tablero, referencia al modelo 'User'
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Hace referencia al modelo 'User'
      required: true, // Es obligatorio asignar un propietario
    },
    // Miembros del tablero, cada uno es una referencia al modelo 'User'
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Referencia al modelo 'User'
        required: true, // Al menos un miembro debe ser asignado
      },
    ],
  },
  {
    // Añade las fechas de creación y actualización automáticamente
    timestamps: true,
  }
);

// Creación del modelo basado en el esquema
const Board = mongoose.model("Board", boardSchema);

export default Board;
