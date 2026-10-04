# 📋 Team Task Manager - Dashboard Relacional Avanzado

¡Bienvenido! Este es un sistema integral de gestión de actividades y control de personal desarrollado bajo una arquitectura **Fullstack**. El proyecto implementa un backend modularizado con APIs REST estandarizadas y una interfaz de usuario interactiva estilo **SPA (Single Page Application)**.

Este desarrollo fue diseñado con un enfoque estricto en buenas prácticas de ingeniería de software, patrones de diseño relacionales y persistencia de datos robusta.

---

## 🚀 Arquitectura y Características Principales

### 🖥️ Backend (Python & Flask)
*   **Modularización por Blueprints:** Separación limpia de responsabilidades dividiendo el sistema en módulos independientes (`ControladorActividades`, `ControladorUsuarios`, `ControladorCategorias`).
*   **Patrón de Diseño Modelo-Controlador:** Desacoplamiento de la lógica de negocio y las consultas SQL directo en la capa de `Modelos`.
*   **Manejo Eficiente de Conexiones:** Implementación de bloques de control `with` para garantizar la apertura, uso y destrucción automática de cursores en memoria.
*   **Respuestas HTTP Estandarizadas:** Control preciso de flujos mediante la validación de `rowcount` en MySQL, devolviendo estados nativos (`200 OK`, `400 Bad Request`, `404 Not Found`).

### 🗄️ Base de Datos (MySQL / MariaDB)
*   **Integridad Referencial:** Implementación estricta de llaves primarias y foráneas (`FOREIGN KEY`) para garantizar la consistencia relacional de los datos.
*   **Consultas Avanzadas (INNER JOIN):** Sincronización multifuncional de tablas en caliente para mapear IDs dinámicos a datos legibles en el cliente.
*   **Borrado Lógico (Soft Delete):** Implementación de una columna de control `activo` (`TINYINT(1)`). Las bajas de personal o áreas no destruyen el historial de auditoría ni rompen las relaciones previas en la base de datos.

### 🌐 Frontend (JavaScript Vanilla, HTML5 & CSS3)
*   **Navegación Dinámica SPA:** Interfaz optimizada basada en Pestañas Modulares independientes (`Tabs`). El contenido conmuta en milisegundos manipulando los estados del DOM sin recargar la página.
*   **Formularios Inteligentes de Doble Personalidad:** Reutilización avanzada de componentes visuales donde un mismo formulario conmuta dinámicamente entre peticiones `POST` (Creación) y `PUT` (Actualización).
*   **Sincronización Reactiva:** Las inserciones o modificaciones en los módulos de empleados o categorías refrescan automáticamente los menús desplegables (`<select>`) del módulo de tareas en tiempo real.
*   **Diseño SaaS Moderno:** Estilizado minimalista con enfoque en la experiencia de usuario (UX) e implementación de layouts responsivos mediante **CSS Grid**.

---

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Python 3.12, Flask, Flask-CORS.
*   **Base de Datos:** MySQL / MariaDB, MySQL Connector.
*   **Frontend:** HTML5 Semántico, CSS3 Moderno (CSS Grid), JavaScript Vanilla (ES6+, Fetch API, Async/Await).
*   **Pruebas de API:** Postman.
*   **Control de Versiones:** Git & GitHub (Flujo de ramificación estructurado).

---

## 📦 Estructura del Proyecto

```text
gestor_tareas_api/
├── Controladores/           # Capa de Orquestación (Blueprints de Flask)
│   ├── ControladorActividades.py
│   ├── ControladorCategorias.py
│   └── ControladorUsuarios.py
├── Modelos/                 # Capa de Acceso a Datos (Consultas SQL)
│   ├── ModeloActividades.py
│   ├── ModeloCategorias.py
│   └── ModeloUsuarios.py
├── Frontend/                # Capa de Presentación (Interfaz Web)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── ConexionBasededatos.py   # Singleton / Singleton-like de Conexión a BD
├── app.py                   # Central y Enrutador Principal del Servidor
└── README.md                # Documentación del Proyecto
```

---

## ⚙️ Instrucciones de Instalación y Despliegue

### 1. Requisitos Previos
Asegúrate de tener instalado Python 3.x y un servidor MySQL local activo (XAMPP, WampServer o MariaDB nativo).

### 2. Configuración de la Base de Datos
Crea una base de datos en tu gestor y ejecuta el script de migración para estructurar las tablas con sus respectivas llaves foráneas y la columna de borrado lógico:
```sql
ALTER TABLE usuarios ADD COLUMN activo TINYINT(1) DEFAULT 1;
ALTER TABLE categorias ADD COLUMN activo TINYINT(1) DEFAULT 1;
ALTER TABLE actividades ADD COLUMN activo TINYINT(1) DEFAULT 1;
```

### 3. Despliegue del Servidor Backend
Abre tu terminal en la raíz del proyecto y ejecuta:
```bash
python app.py
```
El servidor backend se encenderá en modo de depuración (`debug=True`) escuchando en el puerto `http://127.0.0.1:5000`.

### 4. Despliegue del Frontend
Navega a la carpeta `Frontend/` y abre el archivo `index.html` en tu navegador preferido (o levántalo usando la extensión *Live Server* de VS Code en el puerto `5500`).

---

## 🔮 Próximos Pasos (Fase 4)
*   Implementación de un sistema de autenticación seguro basado en **JWT (JSON Web Tokens)**.
*   Cifrado de contraseñas de usuarios en el Backend mediante `bcrypt`.
*   Diseño de un panel de control con restricciones reales basadas en **Roles y Permisos (RBAC)** (Empleado vs Administrador).
