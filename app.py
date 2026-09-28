# app.py (En la raíz del proyecto)
from flask import Flask
from flask_cors import CORS
# Importamos los 3 planos
from Controladores.ControladorActividades import actividades_bp
from Controladores.ControladorUsuarios import usuarios_bp
from Controladores.ControladorCategorias import categoria_bp

app = Flask(__name__)
CORS(app)

# Registramos los 3 planos en la aplicación central
app.register_blueprint(actividades_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(categoria_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
