// 1. La dirección central de tu servidor de Flask
const URL_BASE = 'http://127.0.0.1:5000';

// 2. Función automática que se ejecuta apenas carga la página web
document.addEventListener('DOMContentLoaded', () => {
    console.log("¡El Frontend está vivo y listo!");
    cargarActividades();
    cargarUsuarios();
    cargarCategorias();
    
});

// 3. El cerebro: Hace el mismo trabajo que hacías en Postman con el GET
function cargarActividades() {
    // Es el equivalente a escribir la URL en la barra de direcciones de Postman
    fetch(`${URL_BASE}/actividades`)
        .then(respuesta => respuesta.json()) // Recibe el JSON con el INNER JOIN y tus diccionarios
        .then(actividades => {
            
            // Buscamos el cuerpo de la tabla en el HTML para meter los datos
            const tablaBody = document.getElementById('lista-actividades-body');
            tablaBody.innerHTML = ''; // Limpiamos la tabla por si tiene texto viejo

            // Recorremos la lista de actividades una por una
            actividades.forEach(act => {
                // Creamos una fila física de HTML con las etiquetas de tus diccionarios de Python
                const fila = `
                    <tr>
                        <td>${act.id}</td>
                        <td>${act.nombre_actividad}</td>
                        <td>${act.estado === 0 ? 'Pendiente' : 'Completado'}</td>
                        <td>${act.encargado}</td>
                        <td>${act.categoria}</td>
                        <td>
                            <button class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                `;
                // Inyectamos la fila dentro de la tabla en la pantalla
                tablaBody.innerHTML += fila;
            });

        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

// 🌟 NUEVA FUNCIÓN: Trae los usuarios de MySQL y los mete en el desplegable
function cargarUsuarios() {
    fetch(`${URL_BASE}/usuarios`) // El endpoint GET que creaste solo
        .then(respuesta => respuesta.json())
        .then(usuarios => {
            const selectUsuarios = document.getElementById('usuario_id');
            selectUsuarios.innerHTML = '<option value="">-- Selecciona un Empleado --</option>'; // Limpiamos el "Cargando..."
            
            usuarios.forEach(user => {
                // El 'value' guarda el ID para mandarlo a la BD, pero el ojo humano ve el NOMBRE
                selectUsuarios.innerHTML += `<option value="${user.id}">${user.nombre}</option>`;
            });
        });
}

// 🌟 NUEVA FUNCIÓN: Trae las categorías de MySQL y las mete en el desplegable
function cargarCategorias() {
    fetch(`${URL_BASE}/categorias`) // El endpoint GET de categorías
        .then(respuesta => respuesta.json())
        .then(categorias => {
            const selectCategorias = document.getElementById('categoria_id');
            selectCategorias.innerHTML = '<option value="">-- Selecciona una Categoría --</option>';
            
            categorias.forEach(cat => {
                selectCategorias.innerHTML += `<option value="${cat.id}">${cat.nombre_categoria}</option>`;
            });
        });
}