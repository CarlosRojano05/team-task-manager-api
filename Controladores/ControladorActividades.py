from Modelos.ModeloActividades import ModeloActividades
from flask import jsonify, request, Blueprint

# 🌟 ¡AQUÍ ESTÁ! Aquí es donde creas la variable que luego importas en app.py
actividades_bp = Blueprint('actividades_bp', __name__)

actividades = ModeloActividades()

@actividades_bp.route('/actividades', methods=['GET'])
def obteneractividades():
    
    # 1. Buscamos los datos
    listactividades = actividades.obtener_actividades()
    
    return jsonify(listactividades)
     
@actividades_bp.route('/actividad/<int:id>', methods=['GET'])
def obteneractividad(id):
    
    # 1. Buscamos los datos
    actividad = actividades.obtener_actividad(id)
     
    if actividad is None:
      return jsonify({"mensaje": f"Producto con el ID {id} no encontrado"}), 404 
    
    return jsonify(actividad)

@actividades_bp.route('/nueva_actividad', methods = ['POST'])
def crearactividad():
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    actividad = request.json.get('actividad_')
    estado = request.json.get('estado_')
    usuarios_id = request.json.get('usuarios_id_')
    categoria_id = request.json.get('categoria_id_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not actividad or estado is None or not usuarios_id or not categoria_id:
         return jsonify({"error": "Faltan datos obligatorios (actividad_, estado_, usuarios_id_ o categoria_id_)"}), 400
     
    actividades.ingresar_actividad(actividad, estado, usuarios_id, categoria_id)
    return jsonify({"mensaje": "actividad creada exitosamente"})

@actividades_bp.route('/actualizar_actividad/<int:id>', methods = ['PUT'])
def actualizaractividad(id):
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    actividad = request.json.get('actividad_')
    estado = request.json.get('estado_')
    usuarios_id = request.json.get('usuarios_id_')
    categoria_id = request.json.get('categoria_id_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not actividad or estado is None or not usuarios_id or not categoria_id:
         return jsonify({"error": "Faltan datos obligatorios (actividad_, estado_, usuarios_id_ o categoria_id_)"}), 400
     
    filas_alteradas = actividades.actualizar_actividad(id, actividad, estado, usuarios_id, categoria_id)
    
    if filas_alteradas == 0:
         return jsonify({"error": f"No se encontró la actividad con el ID {id}"}), 404
         
    return jsonify({"mensaje": "actividad actualizada exitosamente"})

@actividades_bp.route('/eliminar_actividad/<int:id>', methods = ['DELETE'])
def eliminaractividad(id):
    if actividades.obtener_actividad(id):
       actividades.eliminar_actividad(id)
       return jsonify({"mensaje": f"actividad con el ID {id} fue eliminada correctamente"})
    else:
       return jsonify({"mensaje": f"actividad con el ID {id} no existe"}), 404 
