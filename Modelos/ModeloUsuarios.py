from ConexionBasededatos import ConexionMysql

class ModeloUsuarios:
    def __init__(self):
        # Al poner (), Python ejecuta el __init__ de ConexionMysql 
        # y crea la conexión y el cursor reales.
       self.conexion_MA = ConexionMysql()
       
    def obtener_usuarios(self):
        # Solo llamas a la función, el 'with' de adentro se encarga del resto
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute("SELECT * FROM usuarios")
            return cursor_temporal.fetchall() # Recuerda retornar los datos. 
        
    def obtener_usuario(self, id):
        # Lo mismo aquí: se abre, se usa y se destruye automáticamente
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
            return cursor_temporal.fetchone()
        
    def ingresar_usuario(self, usuario, email, rol ):
        # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
        sql = "INSERT INTO usuarios (nombre, email, rol) VALUES (%s, %s, %s)"
        valores = (usuario, email, rol)
         
        # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
        with self.conexion_MA.conexion.cursor() as cursor_temporal:
            cursor_temporal.execute(sql, valores)
            
        # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
            self.conexion_MA.conexion.commit()
            
    def actualizar_usuario(self, id, nombre, email, rol):
            # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
            sql = "UPDATE usuarios SET nombre = %s, email = %s, rol = %s WHERE id = %s"
            valores = (nombre, email, rol, id)
             
            # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
            with self.conexion_MA.conexion.cursor() as cursor_temporal:
                cursor_temporal.execute(sql, valores)
                filas_afectadas = cursor_temporal.rowcount
                
            # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                self.conexion_MA.conexion.commit()
                
                return filas_afectadas
                
    def eliminar_usuario(self, id):
                    # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
                    sql = "DELETE FROM usuarios WHERE id = %s"
                    valores = (id,)
                     
                    # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
                    with self.conexion_MA.conexion.cursor() as cursor_temporal:
                        cursor_temporal.execute(sql, valores)
                        
                    # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                        self.conexion_MA.conexion.commit()