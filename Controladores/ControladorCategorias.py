from Modelos.ModeloCategorias import ModeloCategoria
from flask import jsonify, request, Blueprint

# 🌟 ¡AQUÍ ESTÁ! Aquí es donde creas la variable que luego importas en app.py
categoria_bp = Blueprint('categoria_bp', __name__)

categorias = ModeloCategoria()

@categoria_bp.route('/categorias', methods=['GET'])
def obtenercategorias():
    
    # 1. Buscamos los datos
    listacategorias = categorias.obtener_categorias()
    
    return jsonify(listacategorias)

@categoria_bp.route('/categoria/<int:id>', methods=['GET'])
def obtenercategoria(id):
    
    # 1. Buscamos los datos
    categoria = categorias.obtener_categoria(id)
     
    if categoria is None:
      return jsonify({"mensaje": f"categoria con el {id} no encontrada"}), 404 
    
    return jsonify(categoria)

@categoria_bp.route('/nueva_categoria', methods = ['POST'])
def crearcategoria():
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    categoria = request.json.get('categoria_')
    color = request.json.get('color_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not categoria or not color:
         return jsonify({"error": "Faltan datos obligatorios (categoria_, color_)"}), 400
     
    categorias.ingresar_categoria(categoria, color)
    return jsonify({"mensaje": "categoria creada exitosamente"})

@categoria_bp.route('/actualizar_categoria/<int:id>', methods = ['PUT'])
def actualizarcategoria(id):
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    ncategoria = request.json.get('categoria_')
    color = request.json.get('color_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not ncategoria or not color:
         return jsonify({"error": "Faltan datos obligatorios (categoria_ o color_)"}), 400
     
    # Guardamos el resultado del modelo (puede ser 0 o 1)
    filas_modificadas = categorias.actualizar_categoria(id, ncategoria, color)
    
    # VALIDACIÓN DEL ID: Si es 0, significa que el ID no existía en MySQL
    if filas_modificadas == 0:
         return jsonify({"error": f"No se encontró la categoría con el ID {id}"}), 404
    
    return jsonify({"mensaje": "categoria actualizada exitosamente"})

@categoria_bp.route('/eliminar_categoria/<int:id>', methods = ['DELETE'])
def eliminarcategoria(id):
    if categorias.obtener_categoria(id):
       categorias.eliminar_categoria(id)
       return jsonify({"mensaje": f"categoria con el ID {id} eliminado correctamente"})
    else:
       return jsonify({"mensaje": f"categoría con el ID {id} no existe"}), 404