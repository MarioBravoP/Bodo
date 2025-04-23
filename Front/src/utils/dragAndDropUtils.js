/*---------------------------------------------------------------*\
 * Funciones para manejar el arrastre y soltado de tareas
 * 
 * Estas funciones manejan el comportamiento del drag & drop para actualizar
 * el estado de una tarea en el servidor y en el frontend. 
\*---------------------------------------------------------------*/

// Función que maneja el evento de drop (cuando se suelta una tarea en un nuevo estado)
export const handleDrop = async (e, status, fetchData, handleTaskUpdate, taskId) => {
    // Prevenir el comportamiento por defecto del evento de drop
    e.preventDefault();
    
    // Si no se proporciona un taskId, muestra un error y detiene la ejecución
    if (!taskId) {
        console.error("No se pudo obtener el taskId");
        return;
    }

    try {
        // Actualiza el estado de la tarea en el frontend, indicando que ha cambiado de estado
        handleTaskUpdate('update', { _id: taskId, status });
        
        // Hace una petición PUT al servidor para actualizar el estado de la tarea
        const updatedTask = await fetchData(`/api/task/${taskId}`, 'PUT', { status });

        // Si el servidor responde con la tarea actualizada, actualiza el estado en el frontend
        if (updatedTask) {
            handleTaskUpdate('update', updatedTask.task);
        }
    } catch (error) {
        // Si ocurre un error durante la actualización en el servidor, muestra el error
        console.error('Error al actualizar la tarea en el servidor:', error);
    }
};

// Función para manejar el evento de dragOver (necesario para permitir el drop)
export const handleDragOver = (e) => {
    // Prevenir el comportamiento por defecto para habilitar el drop
    e.preventDefault();
};
