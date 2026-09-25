import mysql.connector 

class ConexionMysql:
    def __init__(self):
         # 1. Creamos la conexión directamente en self.conexion
        self.conexion = mysql.connector.connect(
            host = "localhost",
            port = "3306",
            user = "root",
            password = "",
            database = "proyecto_gestion_act",
        )
       
        # El código a continuación NO es obligación, este código solo es para
        # confirmar la conexión con la base de datos.
        
        if self.conexion.is_connected():
            db_info = self.conexion.get_server_info()
            print("Conectada a la versión del servidor MySQL: ", db_info)

    # Código de cierre de conexión
    def cerrar_conexion(self):
        self.conexion.close()  # Cerramos de forma segura