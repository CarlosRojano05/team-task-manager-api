from Modelos.ModeloUsuarios import ModeloUsuarios
from flask import jsonify, request, Blueprint

# 🌟 ¡AQUÍ ESTÁ! Aquí es donde creas la variable que luego importas en app.py
usuarios_bp = Blueprint('usuarios_bp', __name__)

usuarios = ModeloUsuarios()

@usuarios_bp.route('/usuarios', methods=['GET'])
def obtenerusuarios():
    
    # 1. Buscamos los datos
    listausuarios = usuarios.obtener_usuarios()
    
    return jsonify(listausuarios)

@usuarios_bp.route('/usuario/<int:id>', methods=['GET'])
def obtenerusuario(id):
    
    # 1. Buscamos los datos
    usuario = usuarios.obtener_usuario(id)
     
    if usuario is None:
      return jsonify({"mensaje": f"Producto con el ID {id} no encontrado"}), 404 
    
    return jsonify(usuario)


@usuarios_bp.route('/nuevo_usuario', methods = ['POST'])
def crearusuario():
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    nusuario = request.json.get('usuario_')
    email = request.json.get('email_')
    rol = request.json.get('rol_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not nusuario or not email or not rol:
         return jsonify({"error": "Faltan datos obligatorios (usuario_, email_ o rol_)"}), 400
     
    usuarios.ingresar_usuario(nusuario, email, rol)
    return jsonify({"mensaje": "usuario creado exitosamente"})


@usuarios_bp.route('/actualizar_usuario/<int:id>', methods = ['PUT'])
def actualizarusuario(id):
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    nusuario = request.json.get('usuario_')
    email = request.json.get('email_')
    rol = request.json.get('rol_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not nusuario or not email or not rol:
         return jsonify({"error": "Faltan datos obligatorios (actividad_ o estado_)"}), 400
     
    filas_alteradas = usuarios.actualizar_usuario(id, nusuario, email, rol)
    
    if filas_alteradas == 0:
     return jsonify({"error": f"No se encontró el usuario con el ID {id}"}), 404

    return jsonify({"mensaje": "actividad actualizada exitosamente"})


@usuarios_bp.route('/eliminar_usuario/<int:id>', methods = ['DELETE'])
def eliminarusuario(id):
    if usuarios.obtener_usuario(id):
       usuarios.eliminar_usuario(id)
       return jsonify({"mensaje": f"usuario con el ID {id} fue eliminado correctamente"})
    else:
       return jsonify({"mensaje": f"usuario con el ID {id} no existe"}), 404
