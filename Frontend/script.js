// 1. La dirección central de tu servidor de Flask
const URL_BASE = 'http://127.0.0.1:5000';
let idActividadEnEdicion = null; // NUEVO: Guardará el ID de la tarea que se va a actualizar

// 2. Función automática que se ejecuta apenas carga la página web
document.addEventListener('DOMContentLoaded', () => {
    console.log("¡El Frontend está vivo y listo!");
    cargarActividades();
    cargarUsuarios();
    cargarCategorias();

    const formulario = document.getElementById('form-actividad');
    formulario.addEventListener('submit', guardarTarea);
    
    const btnCancelar = document.getElementById('btn-cancelar');
    btnCancelar.addEventListener('click', finalizarFlujoFormulario);

    const formUsuario = document.getElementById('form-usuario');
    formUsuario.addEventListener('submit', guardarUsuario);

    const formCategoria = document.getElementById('form-categoria');
    formCategoria.addEventListener('submit', guardarCategoria);


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
                            <button class="btn-edit" onclick="cargarDatosEnFormulario(
                                        ${act.id}, 
                                        '${act.nombre_actividad}', 
                                        ${act.estado}, 
                                        ${act.usuario_id_original}, 
                                        ${act.categoria_id_original}
                                                                                       )">Editar</button>

                            <button class="btn-delete" onclick="eliminarTarea(${act.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
                // Inyectamos la fila dentro de la tabla en la pantalla
                tablaBody.innerHTML += fila;
            });
            
            
        })
        .catch(error => console.error("Error al conectar con la API:", error));
}

function cargarDatosEnFormulario(id, nombre, estado, usuarioId, categoriaId) {
    // 1. Guardamos el ID en nuestra variable secreta de arriba
    idActividadEnEdicion = id;

    // 2. Inyectamos los valores en las cajas del HTML usando sus IDs
    document.getElementById('actividad_id').value = nombre;
    document.getElementById('estado_id').value = estado;
    document.getElementById('usuario_id').value = usuarioId;
    document.getElementById('categoria_id').value = categoriaId;

    // 3. Cambiamos el texto del botón principal para que el usuario sepa que está editando
    const botonFormulario = document.querySelector('#form-actividad .btn-primary');
    botonFormulario.textContent = "Actualizar Tarea";
    botonFormulario.style.backgroundColor = "#ff9800"; // Le ponemos un color naranja de advertencia

    //  NUEVO: Mostramos el botón de cancelar físico en la pantalla
    document.getElementById('btn-cancelar').style.display = "inline-block";
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
    
    
 // EL TRUCO INTELIGENTE: Si idActividadEnEdicion TIENE UN NÚMERO, hacemos un PUT
    if (idActividadEnEdicion !== null) {
        
        fetch(`${URL_BASE}/actualizar_actividad/${idActividadEnEdicion}`, {
            method: 'PUT', // Tu método avanzado de actualización
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje || resultado.error);
            finalizarFlujoFormulario();
        })
        .catch(error => console.error("Error al actualizar:", error));

    } else {
        // De lo contrario, si está en null, hace el POST normal de antes
        fetch(`${URL_BASE}/nueva_actividad`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje);
            finalizarFlujoFormulario();
        })
        .catch(error => console.error("Error al guardar:", error));
    }
}

// Función auxiliar para limpiar la pantalla y resetear el botón a su estado original
function finalizarFlujoFormulario() {
    document.getElementById('form-actividad').reset();
    idActividadEnEdicion = null; // Reseteamos la variable de control
    
    // Regresamos el botón a su estado normal de Guardar
    const botonFormulario = document.querySelector('#form-actividad .btn-primary');
    botonFormulario.textContent = "Guardar Tarea";
    botonFormulario.style.backgroundColor = ""; // Borra el naranja y vuelve al estilo CSS base
    
    // Escondemos el botón de cancelar otra vez
    document.getElementById('btn-cancelar').style.display = "none";
    cargarActividades(); // Refresca la tabla automáticamente
}
function eliminarTarea(id) {
    //  PRÁCTICA DE SEGURIDAD (Senior): Siempre pregunta antes de borrar algo por error
    if (!confirm(`¿Estás seguro de que deseas eliminar la actividad con ID ${id}?`)) {
        return; // Si el usuario le da a "Cancelar", la función se frena y no pasa nada
    }

    // El viaje por la red directo a tu endpoint /eliminar_actividad/<id>
    fetch(`${URL_BASE}/eliminar_actividad/${id}`, {
        method: 'DELETE' // Configuras el método explícito de borrado
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert(resultado.mensaje); // Muestra el mensaje "actividad eliminada correctamente" de tu Python
        
        // 🌟 REINICIO MANUAL: Volvemos a leer la base de datos para que la fila desaparezca sola de la pantalla
        cargarActividades(); 
    })
    .catch(error => console.error("Error al eliminar la tarea:", error));

}


// SECCIÓN 3: FUNCIÓN PARA ENVIAR EL NUEVO EMPLEADO A FLASK

function guardarUsuario(evento) {
    // 1. Ponemos el "freno de mano" para que la página no parpadee
    evento.preventDefault();

    // 2. Raspamos los datos de las cajas de texto de usuarios
    const nombre = document.getElementById('nombre_usuario').value;
    const email = document.getElementById('email_usuario').value;
    const rol = document.getElementById('rol_usuario').value;

    // 3. Empacamos el JSON exacto. 
    // 🧠 EL PORQUÉ DE LAS LLAVES: Revisa tu ControladorUsuarios.py. 
    // Si allá buscas request.json.get('nombre_') y 'email_', aquí se deben llamar igual.
    const nuevoUsuario = {
        "usuario_": nombre,
        "email_": email,
        "rol_": rol
    };

    // 4. Disparamos el misil POST a tu endpoint de usuarios
    fetch(`${URL_BASE}/nuevo_usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // El letrero frágil para Flask
        },
        body: JSON.stringify(nuevoUsuario) // Aplanamos el objeto a texto plano para el cable
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert(resultado.mensaje || "usuario registrado con éxito"); // Alerta de éxito
        
        // 🌟 REINICIO MANUAL E INTELIGENTE:
        document.getElementById('form-usuario').reset(); // Limpiamos las cajitas de usuario
        cargarUsuarios(); // ¡LA MAGIA! Volvemos a llamar al GET para que el nuevo nombre aparezca de una vez en el menú desplegable de las tareas arriba sin dar F5
    })
    .catch(error => console.error("Error al registrar usuario:", error));
}


// SECCIÓN 4: FUNCIÓN PARA ENVIAR LA NUEVA CATEGORÍA A FLASK

function guardarCategoria(evento) {

    evento.preventDefault();

    // Raspamos el nombre desde su ID único
    const nombreCategoria = document.getElementById('nombre_cat_input').value;
    const color = document.getElementById('color_cat_input').value;

    // Empacamos el JSON para tu ControladorCategorias.py
    const nuevaCategoria = {
        "categoria_": nombreCategoria, // Revisa si en tu Flask lo buscas como 'categoria_' o 'nombre_categoria_'
        "color_": color
    };

    fetch(`${URL_BASE}/nueva_categoria`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaCategoria)
    })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert(resultado.mensaje || "Categoría registrada con éxito");
        
        document.getElementById('form-categoria').reset(); // Limpiamos la cajita de categoría
        cargarCategorias(); // 👈 ¡LA MAGIA! Refrescamos el select de categorías de arriba al instante
    })
    .catch(error => console.error("Error al registrar categoría:", error));
}

