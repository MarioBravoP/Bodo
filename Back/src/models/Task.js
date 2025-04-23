/*---------------------------------------------------------------*\
 * taskModel.js
 * 
 * Modelo de Mongoose para la colección de tareas. Cada tarea está asociada
 * a un usuario (autor), un tablero y tiene varios atributos para gestionar
 * su estado y prioridad.
 * 
 * Funcionalidad:
 * - El título de la tarea es obligatorio y tiene una longitud máxima de 40 caracteres.
 * - La descripción de la tarea es opcional, pero tiene una longitud máxima de 150 caracteres.
 * - El estado de la tarea puede ser "todo", "in_progress" o "done", con "todo" como valor por defecto.
 * - El autor de la tarea es obligatorio y es una referencia al modelo de usuario.
 * - El tablero al que pertenece la tarea es obligatorio y es una referencia al modelo de tablero.
 * - La prioridad de la tarea puede ser "low", "medium" o "high", con "medium" como valor por defecto.
 * - Se almacenan automáticamente las fechas de creación y actualización de la tarea.
 * 
 * Campos:
 * - `title`: Título de la tarea, obligatorio y con una longitud máxima de 40 caracteres.
 * - `description`: Descripción opcional de la tarea, con una longitud máxima de 150 caracteres.
 * - `status`: Estado de la tarea, puede ser "todo", "in_progress" o "done".
 * - `author`: Referencia al usuario autor de la tarea, es obligatorio.
 * - `board`: Referencia al tablero al que pertenece la tarea, es obligatorio.
 * - `priority`: Prioridad de la tarea, puede ser "low", "medium" o "high".
 * 
 * Virtual:
 * - `comments`: Relaciona la tarea con los comentarios mediante un campo virtual.
 * 
 *---------------------------------------------------------------*/

import mongoose from "mongoose";

// Definición del esquema de la tarea
const taskSchema = new mongoose.Schema(
  {
    // Título de la tarea, obligatorio y con una longitud máxima de 40 caracteres
    title: {
      type: String,
      required: true, // Es obligatorio
      trim: true, // Elimina los espacios al principio y al final
      maxlength: [40, "El título de la tarea no puede tener más de 40 caracteres"], // Validación de longitud
    },
    // Descripción de la tarea, opcional y con una longitud máxima de 150 caracteres
    description: {
      type: String,
      default: "", // Valor por defecto si no se proporciona
      maxlength: [150, "La descripción de la tarea no puede tener más de 150 caracteres"], // Validación de longitud
    },
    // Estado de la tarea, puede ser "todo", "in_progress" o "done"
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"], // Los valores permitidos
      default: "todo", // Valor por defecto
    },
    // Autor de la tarea, referencia al modelo 'User'
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Hace referencia al modelo 'User'
      required: true, // Es obligatorio asignar un autor
    },
    // Tablero al que pertenece la tarea, referencia al modelo 'Board'
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board", // Hace referencia al modelo 'Board'
      required: true, // Es obligatorio asignar un tablero
    },
    // Prioridad de la tarea, puede ser "low", "medium" o "high"
    priority: {
      type: String,
      enum: ["low", "medium", "high"], // Los valores permitidos
      default: "medium", // Valor por defecto
    },
  },
  {
    // Añadir fechas de creación y actualización automáticamente
    timestamps: true,
    // Incluir campos virtuales cuando se convierte a JSON o a objetos
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Definición de un campo virtual para los comentarios asociados a la tarea
taskSchema.virtual("comments", {
  ref: "Comment", // Relacionado con el modelo 'Comment'
  localField: "_id", // El campo local que hace la referencia (ID de la tarea)
  foreignField: "task", // El campo en el modelo 'Comment' que hace la referencia a la tarea
});

// Crear el modelo basado en el esquema
const Task = mongoose.model("Task", taskSchema);

export default Task;
