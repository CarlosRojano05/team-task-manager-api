from ModeloActividades import ModeloActividades
from flask import Flask, jsonify, request
from flask_cors import CORS

#codigo ejecucion de la API

app = Flask(__name__)
CORS(app)

actividades = ModeloActividades()

@app.route('/actividades', methods=['GET'])
def obteneractividades():
    
    # 1. Buscamos los datos
    listactividades = actividades.obtener_actividades()
    
    return jsonify(listactividades)
     
@app.route('/actividad/<int:id>', methods=['GET'])
def obteneractividad(id):
    
    # 1. Buscamos los datos
    actividad = actividades.obtener_actividad(id)
     
    if actividad is None:
      return jsonify({"mensaje": "Producto no encontrado"}), 404 
    
    return jsonify(actividad)

@app.route('/nueva_actividad', methods = ['POST'])
def crearactividad():
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    actividad = request.json.get('actividad_')
    estado = request.json.get('estado_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if not actividad or not estado:
         return jsonify({"error": "Faltan datos obligatorios (actividad_ o estado_)"}), 400
     
    actividades.ingresar_actividad(actividad, estado)
    return jsonify({"mensaje": "actividad creada exitosamente"})

@app.route('/actualizar_actividad/<int:id>', methods = ['PUT'])
def actualizaractividad(id):
    # USAMOS .get() por seguridad. Si no viene el dato, no se cae el servidor.
    actividad = request.json.get('actividad_')
    estado = request.json.get('estado_')
    
    #VALIDACIÓN: Si el usuario mandó la petición vacía, le avisamos de inmediato
    if actividad is None or estado is None:
         return jsonify({"error": "Faltan datos obligatorios (actividad_ o estado_)"}), 400
     
    actividades.actualizar_actividad(id, actividad, estado)
    return jsonify({"mensaje": "actividad actualizada exitosamente"})

@app.route('/eliminar_actividad/<int:id>', methods = ['DELETE'])
def eliminaractividad(id):
    if actividades.obtener_actividad(id):
       actividades.eliminar_actividad(id)
       return jsonify({"mensaje": "actividad eliminada correctamente"})
    else:
       return jsonify({"mensaje": "la actividad no existe"}), 404 

if __name__ == '__main__' :
    app.run(debug = True)