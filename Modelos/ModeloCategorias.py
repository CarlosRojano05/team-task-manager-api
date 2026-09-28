from ConexionBasededatos import ConexionMysql

class ModeloCategoria:
    def __init__(self):
        # Al poner (), Python ejecuta el __init__ de ConexionMysql 
        # y crea la conexión y el cursor reales.
       self.conexion_MA = ConexionMysql()
       
    def obtener_categorias(self):
        # Solo llamas a la función, el 'with' de adentro se encarga del resto
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute("SELECT * FROM categoria")
            return cursor_temporal.fetchall() # Recuerda retornar los datos. 
        
    def obtener_categoria(self, id):
        # Lo mismo aquí: se abre, se usa y se destruye automáticamente
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute("SELECT * FROM categoria WHERE id = %s", (id,))
            return cursor_temporal.fetchone()
        
    def ingresar_categoria(self, categoria, color ):
            # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
            sql = "INSERT INTO categoria (nombre_categoria, color_hex) VALUES (%s, %s)"
            valores = (categoria, color)
             
            # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
            with self.conexion_MA.conexion.cursor() as cursor_temporal:
                cursor_temporal.execute(sql, valores)
                
            # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                self.conexion_MA.conexion.commit()
                
    def actualizar_categoria(self, id, categoria, color):
                # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
                sql = "UPDATE categoria SET nombre_categoria = %s, color_hex = %s WHERE id = %s"
                valores = (categoria, color, id)
                 
                # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
                with self.conexion_MA.conexion.cursor() as cursor_temporal:  
                    cursor_temporal.execute(sql, valores)
                    filas_afectadas = cursor_temporal.rowcount # <-- Guardamos cuántas filas se cambiaron
                # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                    self.conexion_MA.conexion.commit()   
                    
                return filas_afectadas    # <-- ¡Retornamos este número al controlador!    
            
    def eliminar_categoria(self, id):
                    # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
                    sql = "DELETE FROM categoria WHERE id = %s"
                    valores = (id,)
                     
                    # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
                    with self.conexion_MA.conexion.cursor() as cursor_temporal:
                        cursor_temporal.execute(sql, valores)
                        
                    # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                        self.conexion_MA.conexion.commit()