from flask_mysqldb import MySQL
import configparser

# MySQL Database Class

class MySQLDatabase:
    def __init__(self, flask_app):
        """Database object for Flask web app"""
        config = configparser.RawConfigParser()
        config.read("db_config.ini")

        flask_app.config["SECRET_KEY"] = config.get("database-config", "SECRET_KEY")
        flask_app.config["MYSQL_DB"] = config.get("mysql-config", "MYSQL_DB")
        flask_app.config["MYSQL_HOST"] = config.get("mysql-config", "MYSQL_HOST")
        flask_app.config["MYSQL_USER"] = config.get("mysql-config", "MYSQL_USER")
        flask_app.config["MYSQL_PASSWORD"] = config.get("mysql-config", "MYSQL_PASSWORD")
        flask_app.config["MYSQL_CURSORCLASS"] = config.get("mysql-config", "MYSQL_CURSORCLASS")

        self.mysql = MySQL(flask_app)

    def queryGet(self, query_str: str, value_tuple: tuple = None) -> dict:
        """Performs a query to the database and fetches one result."""
        with self.mysql.connect as conn:
            cursor = conn.cursor()
            cursor.execute(query_str, value_tuple)
            results = cursor.fetchone()
            cursor.close()

        return results
    
    def queryGetAll(self, query_str: str, value_tuple: tuple = None) -> list[dict]:
        """Performs a query to the database and fetches all results."""
        with self.mysql.connect as conn:
            cursor = conn.cursor()
            cursor.execute(query_str, value_tuple)
            results = cursor.fetchall()
            cursor.close()

        return results

    def querySet(self, query_str: str, value_tuple: tuple = None) -> None:
        """Performs a query to the database and commits any changes made to the database."""
        with self.mysql.connect as conn:
            cursor = conn.cursor()
            cursor.execute(query_str, value_tuple)
            conn.commit()
            cursor.close()
