from ConexionBasededatos import ConexionMysql

class ModeloActividades:
    def __init__(self):
        # Al poner (), Python ejecuta el __init__ de ConexionMysql 
        # y crea la conexión y el cursor reales.
       self.conexion_MA = ConexionMysql()
       
    def obtener_actividades(self):
        
        sql = """
                        SELECT 
                        a.id, 
                        a.nombre_actividad,
                        a.estado, 
                        u.nombre AS encargado,
                        c.nombre_categoria AS categoria,
                        a.usuarios_id AS usuario_id_original,     
                        a.categoria_id AS categoria_id_original
                    FROM actividades a 
                    INNER JOIN usuarios u ON a.usuarios_id = u.id
                    INNER JOIN categoria c ON a.categoria_id = c.id
              """
                    
        # Solo llamas a la función, el 'with' de adentro se encarga del resto
                      #Agregamos dictionary=True dentro del cursor()
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute(sql)
            return cursor_temporal.fetchall() # Recuerda retornar los datos. 
    
    def obtener_actividad(self, id):
        sql = """
                                SELECT 
                                a.id, 
                                a.nombre_actividad,
                                a.estado, 
                                u.nombre AS encargado,
                                c.nombre_categoria AS categoria,
                                a.usuarios_id AS usuario_id_original,     
                                a.categoria_id AS categoria_id_original
                            FROM actividades a 
                            INNER JOIN usuarios u ON a.usuarios_id = u.id
                            INNER JOIN categoria c ON a.categoria_id = c.id
                            WHERE a.id = %s
                      """
        
        # Lo mismo aquí: se abre, se usa y se destruye automáticamente
        with self.conexion_MA.conexion.cursor(dictionary=True) as cursor_temporal:
            cursor_temporal.execute(sql,[id])
            return cursor_temporal.fetchone()
    
    def ingresar_actividad(self, actividad, estado, usuarios_id, categoria_id):
        # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
        sql =   """
                    INSERT INTO actividades (nombre_actividad, estado, usuarios_id, categoria_id)
                    VALUES (%s, %s, %s, %s)
                """
        valores = (actividad, estado, usuarios_id, categoria_id)
         
        # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
        with self.conexion_MA.conexion.cursor() as cursor_temporal:
            cursor_temporal.execute(sql, valores,)
            
        # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
            self.conexion_MA.conexion.commit()
            
    def actualizar_actividad(self, id, actividad, estado, usuarios_id, categoria_id):
            # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
            sql =  """
                    UPDATE actividades SET nombre_actividad = %s, estado =%s, usuarios_id = %s, categoria_id = %s 
                    WHERE id = %s
                    """
            valores = (actividad, estado, usuarios_id, categoria_id, id)
             
            # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
            with self.conexion_MA.conexion.cursor() as cursor_temporal:
                cursor_temporal.execute(sql, valores)
                filas_afectadas = cursor_temporal.rowcount # <-- Guardamos cuántas filas se cambiaron
                
            # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                self.conexion_MA.conexion.commit()
                
                return filas_afectadas
                
    def eliminar_actividad(self, id):
                # 1. Creamos la consulta SQL y agrupamos los valores de forma segura
                sql = "DELETE FROM actividades WHERE id = %s"
                valores = (id,)
                 
                # 2. Usamos el 'with' con la conexión directa para crear un cursor temporal
                with self.conexion_MA.conexion.cursor() as cursor_temporal:
                    cursor_temporal.execute(sql, valores)
                    
                # 3. ¡EL PASO CLAVE! Confirmamos la inserción en la base de datos
                    self.conexion_MA.conexion.commit()
                    
                