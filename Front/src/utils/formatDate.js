/*---------------------------------------------------------------*\
 * Función para formatear fechas a un formato legible
 * 
 * Esta función convierte una marca de tiempo (timestamp) en una fecha
 * y la formatea a un formato específico: día, mes, año, hora y minuto.
 * El formato resultante es "dd/mm/yyyy hh:mm", con la localización en español.
\*---------------------------------------------------------------*/

export const formatDate = (timestamp) => {
    // Crea un objeto Date a partir del timestamp
    const date = new Date(timestamp);

    // Devuelve la fecha formateada como una cadena de texto en el formato "dd/mm/yyyy hh:mm"
    return date.toLocaleString('es-ES', {
        day: '2-digit',   // Día con dos dígitos
        month: '2-digit', // Mes con dos dígitos
        year: 'numeric',  // Año con cuatro dígitos
        hour: '2-digit',  // Hora con dos dígitos
        minute: '2-digit',// Minuto con dos dígitos
    });
};
