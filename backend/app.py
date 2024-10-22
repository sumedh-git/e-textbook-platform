# backend/app.py
from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from config import get_db_connection

app = Flask(__name__)
CORS(app)

def execute_sql_script(script_path):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    with open(script_path, 'r') as file:
        sql_script = file.read()

    # Split script by statements (optional, for multi-statement execution)
    sql_commands = sql_script.split(';')

    for command in sql_commands:
        # Execute non-empty commands
        if command.strip():
            try:
                cursor.execute(command)
            except Exception as e:
                print(f"Error executing command: {command}")
                print(f"Error: {e}")

    connection.commit()
    cursor.close()
    connection.close()

# Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

if __name__ == '__main__':
    execute_sql_script('D:/NCSU_SEM3/DBMS/e-textbook-platform/sql/init_db.sql')
    app.run(debug=True)