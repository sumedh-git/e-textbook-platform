import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        # Create a connection to the MySQL database
        connection = mysql.connector.connect(
            host='localhost',         # Your MySQL server's host (localhost for local)
            user='root',         # Your MySQL username
            password='<Insert_Your_Password_Here>', # Your MySQL password
            database='elearning_platform', # The database you want to connect to
            port=3306                 # Optional: the default MySQL port is 3306
        )

        if connection.is_connected():
            print("Connection to MySQL database is successful")
            return connection

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None