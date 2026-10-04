// 1. La dirección central de tu servidor de Flask
const URL_BASE = 'http://127.0.0.1:5000';
let idActividadEnEdicion = null; // NUEVO: Guardará el ID de la tarea que se va a actualizar
let idUsuarioEnEdicion = null;    
let idCategoriaEnEdicion = null;

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

    // 🌟 CONTROLADOR DE PESTAÑAS (TABS) DINÁMICAS
    const botonesPestañas = document.querySelectorAll('.tab-btn');
    const contenidosPestañas = document.querySelectorAll('.tab-content');

    botonesPestañas.forEach(boton => {
        boton.addEventListener('click', () => {
            // A. Quitamos la clase 'active' al botón que la tenía antes
            document.querySelector('.tab-btn.active').classList.remove('active');
            // B. Le ponemos 'active' al botón que el usuario acaba de presionar
            boton.classList.add('active');

            // C. Ocultamos todos los contenedores de los formularios abajo
            contenidosPestañas.forEach(contenido => contenido.classList.remove('active'));
            
            // D. Raspamos el 'data-tab' secreto del botón y encendemos el cajón correcto
            const pestañaObjetivo = boton.getAttribute('data-tab');
            document.getElementById(pestañaObjetivo).classList.add('active');
        });
    });

    document.getElementById('btn-cancelar-user').addEventListener('click', finalizarFlujoUsuario);
    document.getElementById('btn-cancelar-cat').addEventListener('click', finalizarFlujoCategoria);
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
    fetch(`${URL_BASE}/usuarios`)
        .then(respuesta => respuesta.json())
        .then(usuarios => {
            // A. Rellenamos el menú desplegable (El de las tareas arriba)
            const selectUsuarios = document.getElementById('usuario_id');
            selectUsuarios.innerHTML = '<option value="">-- Selecciona un Empleado --</option>';
            
            // 🌟 B. Atrapamos el cuerpo de la nueva tabla de empleados habilitados
            const tablaUsuariosBody = document.getElementById('lista-usuarios-body');
            tablaUsuariosBody.innerHTML = ''; // Limpiamos residuos viejos

            usuarios.forEach(user => {
                // Llenamos el select desplegable
                selectUsuarios.innerHTML += `<option value="${user.id}">${user.nombre}</option>`;
                
                // 🌟 Llenamos la fila física de la tabla de empleados
                const filaUser = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.nombre}</td>
                        <td>${user.email}</td>
                        <td>${user.rol}</td>
                        <td>
                            <!-- Pasamos el ID al misil de borrado lógico -->
                            <button class="btn-edit" onclick="cargarDatosUsuarioForm(${user.id}, '${user.nombre}', '${user.email}', '${user.rol}')">Editar</button>
                            <button class="btn-delete" onclick="eliminarUsuario(${user.id})">Desactivar</button>
                        </td>
                    </tr>
                `;
                tablaUsuariosBody.innerHTML += filaUser;
            });
        })
        .catch(error => console.error("Error al cargar usuarios:", error));
}


// NUEVA FUNCIÓN: Trae las categorías de MySQL y las mete en el desplegable
function cargarCategorias() {
    fetch(`${URL_BASE}/categorias`)
        .then(respuesta => respuesta.json())
        .then(categorias => {
            // A. Rellenamos el menú desplegable de tareas
            const selectCategorias = document.getElementById('categoria_id');
            selectCategorias.innerHTML = '<option value="">-- Selecciona una Categoría --</option>';
            
            // 🌟 B. Atrapamos el cuerpo de la nueva tabla de categorías
            const tablaCategoriasBody = document.getElementById('lista-categorias-body');
            tablaCategoriasBody.innerHTML = '';

            categorias.forEach(cat => {
                // Llenamos el select desplegable
                selectCategorias.innerHTML += `<option value="${cat.id}">${cat.nombre_categoria}</option>`;
                
                // 🌟 Llenamos la fila física de la tabla de áreas
                const filaCat = `
                    <tr>
                        <td>${cat.id}</td>
                        <td>${cat.nombre_categoria}</td>
                        <td><span style="color: ${cat.color}; font-weight: bold;">■</span> ${cat.color}</td>
                        <td>
                            <button class="btn-edit" onclick="cargarDatosCategoriaForm(${cat.id}, '${cat.nombre_categoria}', '${cat.color}')">Editar</button>
                            <button class="btn-delete" onclick="eliminarCategoria(${cat.id})">Desactivar</button>
                        </td>
                    </tr>
                `;
                tablaCategoriasBody.innerHTML += filaCat;
            });
        })
        .catch(error => console.error("Error al cargar categorías:", error));
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
    evento.preventDefault();

    const nombre = document.getElementById('nombre_usuario').value;
    const email = document.getElementById('email_usuario').value;
    const rol = document.getElementById('rol_usuario').value;

    const datosUsuario = {
        "nombre_": nombre,
        "email_": email,
        "rol_": rol
    };

    // 🌟 EVALUACIÓN INTELIGENTE PARA USUARIOS
    if (idUsuarioEnEdicion !== null) {
        // Hacemos el PUT hacia el endpoint de actualizar (Asegúrate de tener esta ruta en tu Flask)
        fetch(`${URL_BASE}/actualizar_usuario/${idUsuarioEnEdicion}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje || "Empleado actualizado");
            finalizarFlujoUsuario();
        })
        .catch(error => console.error("Error al actualizar usuario:", error));
    } else {
        // POST tradicional de antes
        fetch(`${URL_BASE}/nuevo_usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosUsuario)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje || "Empleado registrado");
            finalizarFlujoUsuario();
        })
        .catch(error => console.error("Error al registrar usuario:", error));
    }
}



// SECCIÓN 4: FUNCIÓN PARA ENVIAR LA NUEVA CATEGORÍA A FLASK

function guardarCategoria(evento) {
    evento.preventDefault();

    const nombreCategoria = document.getElementById('nombre_cat_input').value;
    const color = document.getElementById('color_cat_input').value;

    const datosCategoria = {
        "categoria_": nombreCategoria,
        "color_": color
    };

    // 🌟 EVALUACIÓN INTELIGENTE PARA CATEGORÍAS
    if (idCategoriaEnEdicion !== null) {
        fetch(`${URL_BASE}/actualizar_categoria/${idCategoriaEnEdicion}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCategoria)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje || "Categoría actualizada");
            finalizarFlujoCategoria();
        })
        .catch(error => console.error("Error al actualizar categoría:", error));
    } else {
        fetch(`${URL_BASE}/nueva_categoria`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCategoria)
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            alert(resultado.mensaje || "Categoría registrada");
            finalizarFlujoCategoria();
        })
        .catch(error => console.error("Error al registrar categoría:", error));
    }
}


// =======================================================
// SECCIÓN DE BORRADO LÓGICO PARA EMPLEADOS Y CATEGORÍAS
// =======================================================
window.eliminarUsuario = function(id) {
    if (!confirm(`¿Estás seguro de que deseas dar de baja al empleado con ID ${id}? Sus tareas pasadas no se perderán.`)) {
        return;
    }

    fetch(`${URL_BASE}/eliminar_usuario/${id}`, { method: 'DELETE' })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert(resultado.mensaje || resultado.error);
        cargarUsuarios(); // 👈 Recarga instantánea: Refresca su tabla y el select de arriba al mismo tiempo
        cargarActividades(); // Refrescamos las actividades por si cambió algún estado
    })
    .catch(error => console.error("Error al desactivar usuario:", error));
}

window.eliminarCategoria = function(id) {
    if (!confirm(`¿Estás seguro de que deseas desactivar el área con ID ${id}?`)) {
        return;
    }

    fetch(`${URL_BASE}/eliminar_categoria/${id}`, { method: 'DELETE' })
    .then(respuesta => respuesta.json())
    .then(resultado => {
        alert(resultado.mensaje || resultado.error);
        cargarCategorias(); // 👈 Recarga la tabla de áreas y limpia su select arriba
        cargarActividades();
    })
    .catch(error => console.error("Error al desactivar categoría:", error));
}

// =======================================================
// CARGAR EMPLEADO EN FORMULARIO
// =======================================================
window.cargarDatosUsuarioForm = function(id, nombre, email, rol) {
    idUsuarioEnEdicion = id; // Guardamos el ID secreto

    document.getElementById('nombre_usuario').value = nombre;
    document.getElementById('email_usuario').value = email;
    document.getElementById('rol_usuario').value = rol;

    const botonForm = document.querySelector('#form-usuario .btn-primary');
    botonForm.textContent = "Actualizar Empleado";
    botonForm.style.backgroundColor = "#ff9800"; // Naranja de edición

    document.getElementById('btn-cancelar-user').style.display = "inline-block"; // Mostramos cancelar
}

// =======================================================
// CARGAR CATEGORÍA EN FORMULARIO
// =======================================================
window.cargarDatosCategoriaForm = function(id, nombre, color) {
    idCategoriaEnEdicion = id;

    document.getElementById('nombre_cat_input').value = nombre;
    document.getElementById('color_cat_input').value = color;

    const botonForm = document.querySelector('#form-categoria .btn-primary');
    botonForm.textContent = "Actualizar Categoría";
    botonForm.style.backgroundColor = "#ff9800";

    document.getElementById('btn-cancelar-cat').style.display = "inline-block";
}
window.finalizarFlujoUsuario = function() {
    document.getElementById('form-usuario').reset();
    idUsuarioEnEdicion = null;
    const botonForm = document.querySelector('#form-usuario .btn-primary');
    botonForm.textContent = "Registrar Empleado";
    botonForm.style.backgroundColor = "";
    document.getElementById('btn-cancelar-user').style.display = "none";
    cargarUsuarios();
}

window.finalizarFlujoCategoria = function() {
    document.getElementById('form-categoria').reset();
    idCategoriaEnEdicion = null;
    const botonForm = document.querySelector('#form-categoria .btn-primary');
    botonForm.textContent = "Registrar Categoría";
    botonForm.style.backgroundColor = "";
    document.getElementById('btn-cancelar-cat').style.display = "none";
    cargarCategorias();
}
