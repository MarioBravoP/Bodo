/*---------------------------------------------------------------*\
 * userModel.js
 * 
 * Modelo de Mongoose para la colección de usuarios. Cada usuario tiene
 * atributos básicos como el nombre, correo electrónico, contraseña, etc.
 * Además, incluye lógica para gestionar solicitudes de contacto, así como
 * el hash de contraseñas antes de almacenarlas.
 * 
 * Funcionalidad:
 * - Se asegura que la contraseña sea encriptada antes de ser almacenada.
 * - Los usuarios pueden tener contactos, y también solicitudes de contacto pendientes.
 * - El rol del usuario puede ser "user" o "admin".
 * 
 * Campos:
 * - `name`: Nombre del usuario, obligatorio.
 * - `email`: Correo electrónico del usuario, obligatorio y único.
 * - `profileImage`: Imagen de perfil del usuario, es opcional.
 * - `profileImagePublicId`: Identificador público de la imagen de perfil, opcional.
 * - `password`: Contraseña del usuario, obligatoria. Se encripta antes de guardar.
 * - `contacts`: Lista de referencias a otros usuarios (contactos), puede ser vacía.
 * - `pendingRequests`: Lista de solicitudes de amistad, que incluyen el usuario y el estado de la solicitud.
 * - `role`: Rol del usuario, puede ser "user" o "admin". Valor predeterminado: "user".
 * 
 * Pre-hook:
 * - `pre("save")`: Encripta la contraseña antes de guardarla en la base de datos si esta ha sido modificada.
 * 
 *---------------------------------------------------------------*/

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Definición del esquema para el usuario
const UserSchema = new mongoose.Schema({
    // Nombre del usuario, obligatorio y sin espacios adicionales
    name: { type: String, required: true, trim: true , maxlength: [60, "El nombre no puede tener más de 40 caracteres"],},
    // Correo electrónico del usuario, obligatorio y único
    email: { type: String, required: true, unique: true, trim: true, maxlength: [60, "El email no puede tener más de 40 caracteres"], },
    // Imagen de perfil, es opcional
    profileImage: { type: String, default: "" },
    // ID público de la imagen de perfil, utilizado por servicios externos
    profileImagePublicId: { type: String, default: "" },
    // Contraseña del usuario, es obligatoria
    password: { type: String, required: true },
    // Lista de contactos, que son referencias a otros usuarios
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Solicitudes pendientes de amistad, cada solicitud tiene un usuario y un estado
    pendingRequests: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Usuario al que se envió la solicitud
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'], // Los estados posibles de la solicitud
                default: 'pending', // Valor predeterminado: 'pending'
            },
        },
    ],
    // Rol del usuario, puede ser 'user' o 'admin'. Valor predeterminado: 'user'
    role: {
        type: String,
        enum: ['user', 'admin'], // Los roles disponibles
        default: 'user', // Valor por defecto: 'user'
    },
}, { timestamps: true }); // Se añade el campo 'createdAt' y 'updatedAt' automáticamente

// Pre-hook para encriptar la contraseña antes de guardar el usuario
UserSchema.pre("save", async function (next) {
    // Si la contraseña no ha sido modificada, no es necesario encriptarla
    if (!this.isModified("password")) return next();
    // Encriptar la contraseña utilizando bcrypt con un coste de 12
    this.password = await bcrypt.hash(this.password, 12);
    // Continuar con la ejecución del 'save'
    next();
});

// Crear y exportar el modelo de Usuario basado en el esquema
export default mongoose.model("User", UserSchema);
