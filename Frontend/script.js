// 1. La dirección central de tu servidor de Flask
const URL_BASE = 'http://127.0.0.1:5000';

// 2. Función automática que se ejecuta apenas carga la página web
document.addEventListener('DOMContentLoaded', () => {
    console.log("¡El Frontend está vivo y listo!");
    cargarActividades();
    cargarUsuarios();
    cargarCategorias();

    const formulario = document.getElementById('form-actividad');

    formulario.addEventListener('submit', guardarTarea);
    
});

//  El cerebro: Hace el mismo trabajo que hacías en Postman con el GET
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

// NUEVA FUNCIÓN: Trae los usuarios de MySQL y los mete en el desplegable
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

// NUEVA FUNCIÓN: Trae las categorías de MySQL y las mete en el desplegable
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

function guardarTarea(evento) { 

    //  EL PORQUÉ DE ESTA LÍNEA (Vital en la industria):
    // Por defecto, en los navegadores web, cuando presionas un botón "submit", la página entera se recarga y borra todo lo que habías escrito.
    // 'preventDefault()' le dice al navegador: "¡Quieto ahí! No recargues la página, yo me encargaré de manejar los datos en silencio con JavaScript"
     evento.preventDefault();

     const nombreActividad = document.getElementById('actividad_id').value;
     const estado = parseInt(document.getElementById('estado_id').value); // 'parseInt' convierte el texto "0" en el número entero 0
     const usuarioId = parseInt(document.getElementById('usuario_id').value);
     const categoriaId = parseInt(document.getElementById('categoria_id').value);

     // 3. Fabricamos el paquete JSON idéntico a como lo hacías en el Body de Postman
    //  EL PORQUÉ DE LAS LLAVES: Deben llamarse exactamente igual a como tu Flask las busca con el request.json.get()

     const nuevaTarea = {
        "actividad_": nombreActividad,
        "estado_": estado,
        "usuarios_id_": usuarioId, 
        "categoria_id_": categoriaId
    };
    
    // 4. El viaje por la red usando fetch con método POST
    // 🧠 EL PORQUÉ DE LA CONFIGURACIÓN: Por defecto fetch() hace GET. Para mutar datos, debemos configurarlo de forma explícita.
    fetch(`${URL_BASE}/nueva_actividad`, {
        method: 'POST', // Le decimos que es una inserción
        headers: {
            'Content-Type': 'application/json' // Le avisa a Flask: "Oye, te estoy enviando un paquete de datos tipo JSON, no texto plano"
        },
        body: JSON.stringify(nuevaTarea) // Convierte el objeto de JavaScript en una cadena de texto JSON que pueda viajar por los cables de red
    })
    .then(respuesta => respuesta.json()) // Esperamos la respuesta de tu API
    .then(resultado => {
        alert(resultado.mensaje); // Muestra un letrero en la pantalla con el "actividad creada exitosamente" de tu Flask
        
        // 5. Buenas prácticas de interfaz:
        document.getElementById('form-actividad').reset(); // Limpia todas las cajas del formulario para que queden vacías de nuevo
        cargarActividades(); // Vuelve a llamar a la función de lectura para que la tabla se actualice sola y veas la nueva tarea ahí mismo sin darle F5
    })
    .catch(error => console.error("Error al guardar la tarea:", error));
}
