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
      return jsonify({"mensaje": "categoria no encontrada"}), 404 
    
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