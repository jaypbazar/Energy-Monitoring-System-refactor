from flask import Flask, render_template, request, redirect, flash, session
from flask_mysqldb import MySQL
from datetime import datetime
import configparser

'''
NOTES FROM CO-PROGRAMMER:
    These are functionalities required to run the frontend properly.

    [/]TODO: add a '/login' route to process login

    [/]TODO: when logged in add session['user']=username
    
    [/]TODO: redirect main('/') route to login when user not in session otherwise to home
    
    [/]TODO: fetch all usernames from database into session['username_list'] for validation (cannot have same username)
    
    [/]TODO: use flash in error messages (import flash from flask)
          format: flash('<error message>', 'message type')
          message types: 'success', 'danger', 'info', 'warning'
          'success' = green
          'danger' = red
          'info' = blue
          'warning' = yellow

    [/]TODO: check every route if there is session['user'], if none redirect to login

'''

'''
NOTES TO SELF:
    [/]TODO: Integrate Database object so it looks cleaner and organized.
    
    [x]TODO: Simplify and organize code. (Nothing wrong with making another Python file to organize the code more).
       Reason: Seems like flask_mysqldb has some issues with database connections if on a separate file as it's trying
       to find an active AppContext object thing. idk. it just doesnt work.
'''

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

app = Flask(__name__)
mysql = MySQLDatabase(app)

@app.before_request
def checkSession():
    """Checks if the user is currently logged in the current session."""
    if 'user' not in session.keys():
        # initialize the 'user' key in session cookie if nonexistent
        session['user'] = ''

    elif session['user'] == '':
        # redirect to login page if user isn't logged in first
        if request.endpoint not in ['static', 'login', 'register']:
            # Make sure it's not from login or a redirection loop will occur
            # Also make sure it's not from static so it won't flash the alert pop-up multiple times.
            flash("You must log in first before proceeding.", 'warning')
            return redirect('/login')
    
@app.before_request
def updateUsernameList():
    if request.endpoint in ['login', 'signup']:
        # Update only when the request is from login or signup
        usernames = mysql.queryGetAll("SELECT UserName FROM auth")
        usernames = [x['UserName'] for x in usernames]
        session['username_list'] = usernames


# ============================================= User Interface ========================================================

# Root Redirect
@app.route('/')
def index():
    return redirect('/home')

# Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if session['user']:
        return redirect('/home')
    
    else:
        if request.method == 'GET':
            return render_template('auth/login.html')
        
        elif request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')

            if username not in session['username_list']:
                flash(f"User \"{username}\" not found in database. Try signing up.", 'warning')
            else:
                userPassword = mysql.queryGet(
                    'SELECT Password FROM auth WHERE UserName = %s',
                    (username,)
                )

                if password != userPassword['Password']:
                    flash("Incorrect password entered. Please try again.", 'danger')
                
                else:
                    session['user'] = username
            return redirect('/')

# Logout Route
@app.route('/logout', methods=['GET'])
def logout():
    _ = session.pop('user')
    return redirect('/login')

# Signup Page
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('auth/signup.html')
    
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')     

        if username in session['username_list']:
            flash(f'User "{username}" already exists.', 'danger')
            return redirect('/signup')

        else:
            if mysql.queryGet('SELECT * FROM auth WHERE UserName = %s',(username,)):
                flash(f'User "{username}" already exists.', 'danger')
                return redirect('/signup')
            else:
                mysql.querySet(
                    'INSERT INTO auth (UserName, Password) VALUES (%s,%s)',
                    (username, password)
                )
                flash("Registration successful! You can now log in with your new account.", 'success')
                return redirect('/')

# Home Page Rendering
@app.route('/home')
def home_page():
    return render_template('home.html')

# Home Page Searching
@app.route('/search_equipment', methods=['GET'])
def search_equipment():
    equipment_name = request.args.get('equipment_name')

    equipment = mysql.queryGet('SELECT EQUIPMENTS.*, CompanyName FROM equipments, company WHERE EquipmentName = %s AND equipments.CompanyID=company.CompanyID', 
                (equipment_name,)
                )

    if equipment == None:
        return render_template('search_not_found.html')
    
    return render_template('search_results.html', equipment=equipment)

# Add New page rendering
@app.route('/add_new')
def add_new():
    return render_template('forms/add_new.html')

# All Equipments Overview page rendering
@app.route('/equipment_overview')
def equipment_overview():
    if request.method == 'GET':
        equipments = mysql.queryGetAll(
            'SELECT EquipmentID, EquipmentName FROM equipments'
        )

        return render_template('equipments/equipment_overview.html', equipments=equipments)

# Display Logs
@app.route('/logs')
def display_logs():
    if request.method == 'GET':
        data = mysql.queryGetAll(
            'SELECT A.*, E.EquipmentName, O.OperatorName FROM alerts A, equipments E, operators O WHERE A.EquipmentID=E.EquipmentID AND A.OperatorID=O.OperatorID;'
        )

        return render_template('display_data/display_alerts_data.html', data=data)
   
# Display Operators Table
@app.route('/display_operators')
def display_operators():
    data = mysql.queryGetAll(
        "SELECT O.*, C.CompanyName FROM operators O, company C WHERE O.CompanyID=C.CompanyID;"
    )
    
    return render_template('display_data/display_operators_data.html', data=data)

# Display Energy Usage
@app.route('/display_energy_usage')
def display_energy_usage():
    data = mysql.queryGetAll(
        "SELECT E.EquipmentID, E.EquipmentName, SUM(A.EnergyConsumed) AS EnergyConsumed FROM alerts A , equipments E WHERE A.EquipmentID=E.EquipmentID GROUP BY E.EquipmentID;"
    )

    return render_template('display_data/display_energy_usage.html', data=data)

# Display Companies
@app.route('/display_companies')
def display_companies():
    data = mysql.queryGetAll(
        "SELECT * FROM company"
    )

    return render_template('display_data/display_company_data.html', data=data)
    
# Selected Equipment Page rendering
@app.route('/equipment_<equipment_id>', methods=['GET', 'POST'])
def equipment_detail(equipment_id):
    if request.method == 'GET':
        equipment = mysql.queryGet(
            'SELECT * FROM equipments WHERE EquipmentID = %s',
            (equipment_id,)
        )

        result = mysql.queryGetAll(
            "SELECT OperatorID FROM operators"
        )

        operators = [(row['OperatorID']) for row in result]

        return render_template('equipments/equipment_detail.html', equipment=equipment, operators = operators)

    elif request.method == 'POST':
        operator_id = request.form.get('OperatorID')
        mysql.querySet(
            'INSERT INTO operates (OperatorID, EquipmentID) VALUES (%s, %s)',
            (operator_id, equipment_id)
        )

        operates = mysql.queryGetAll(
            'SELECT * FROM operates'
        )

        return render_template('display_data/display_operates_data.html', operates=operates)

# Selected Equipment adding Alert page rendering and logic
@app.route('/equipment_<equipment_id>/add_log', methods = ['POST', 'GET'])
def add_log(equipment_id):
    if request.method == 'GET':
        result = mysql.queryGet(
            "SELECT AlertID FROM alerts ORDER BY AlertID DESC LIMIT 1"
        )

        latest_alert_id = result['AlertID'] if result else None
        new_alert_id = increment_id("A", latest_alert_id)
        TimeStamp = datetime.now()

        return render_template('equipments/add_log.html', latest_alert_id = new_alert_id, equipment_id = equipment_id, time_stamp = TimeStamp)
    
    elif request.method == 'POST':
        OperatorID = request.form['OperatorID']
        EnergyConsumed = request.form['EnergyConsumed']
        TimeStamp = datetime.now()

        result = mysql.queryGet(
            "SELECT AlertID FROM alerts ORDER BY AlertID DESC LIMIT 1"
        )

        latest_alert_id = result['AlertID'] if result else None
        new_alert_id = increment_id("AL", latest_alert_id)

        operates_check = mysql.queryGet(
            "SELECT OperatorID FROM operates WHERE OperatorID = %s AND EquipmentID = %s",
            (OperatorID, equipment_id)
        )

        if operates_check == None:
            mysql.querySet(
                "INSERT INTO operates VALUES(%s,%s)",
                (OperatorID, equipment_id)
            )

        mysql.querySet(
            "INSERT INTO alerts VALUES(%s,%s,%s,%s,%s)",
            (new_alert_id, equipment_id, OperatorID, EnergyConsumed, TimeStamp)
        )

        data = mysql.queryGetAll(
            "SELECT A.*, E.EquipmentName, O.OperatorName FROM alerts A, equipments E, operators O WHERE A.EquipmentID=E.EquipmentID AND A.OperatorID=O.OperatorID;"
        )

        return render_template('display_data/display_alerts_data.html', data=data)


# Company Entry Page
@app.route('/company', methods = ['POST', 'GET'])
def company_entry():
    if request.method == 'GET':
        result = mysql.queryGet(
            'SELECT CompanyID FROM company ORDER BY CompanyID DESC LIMIT 1'
        )

        latest_company_id = result['CompanyID'] if result else None
        new_company_id = increment_id("C", latest_company_id)
        
        return render_template('forms/company.html', latest_company_id=new_company_id)
    
    if request.method == 'POST':
        CompanyName = request.form['CompanyName']
        Location = request.form['Location']
        Contact = request.form['Contact']

        result = mysql.queryGet(
            "SELECT CompanyID FROM company ORDER BY CompanyID DESC LIMIT 1"
        )

        latest_company_id = result['CompanyID'] if result else None
        new_company_id = increment_id("C", latest_company_id)

        mysql.querySet(
            "INSERT INTO company VALUES(%s,%s,%s,%s)",
            (new_company_id,CompanyName, Location, Contact)
        )

        data = mysql.queryGetAll(
            'SELECT * FROM company'
        )

        return render_template('display_data/display_company_data.html', data=data)

# Company Data Page
@app.route('/company_data')
def display_company_data():
    try:
        data = mysql.queryGetAll("SELECT * FROM company")
        return render_template('display_data/display_company_data.html', data=data)
    
    except Exception as e:
        print("Error fetching data:", str(e))
        flash("Error fetching data. Please check the console for details.", 'danger')
        return redirect('/company_data')
    
# Equipments Entry Page
@app.route('/equipments', methods = ['POST', 'GET'])
def equipments_entry():
    if request.method == 'GET':
        result = mysql.queryGet(
            "SELECT EquipmentID FROM equipments ORDER BY EquipmentID DESC LIMIT 1"
        )
        
        latest_equipment_id = result['EquipmentID'] if result else None
        new_equipment_id = increment_id("E", latest_equipment_id)

        result = mysql.queryGetAll(
            "SELECT CompanyID FROM company"
        )
        
        companies = [row['CompanyID'] for row in result]
        
        return render_template('forms/equipments.html', latest_equipment_id=new_equipment_id, companies=companies)
    
    elif request.method == 'POST':
        EquipmentName = request.form['EquipmentName']
        PowerRating = request.form['PowerRating']
        ManufacturingDate = request.form['ManufacturingDate']
        CompanyID = request.form['CompanyID']        

        result = mysql.queryGet(
            "SELECT EquipmentID FROM equipments ORDER BY EquipmentID DESC LIMIT 1"
        )
        
        latest_equipment_id = result['EquipmentID'] if result else None
        new_equipment_id = increment_id("E", latest_equipment_id)

        mysql.querySet(
            "INSERT INTO equipments VALUES(%s,%s,%s,%s,%s)",
            (new_equipment_id, EquipmentName, PowerRating, ManufacturingDate, CompanyID)
        )
        
        data = mysql.queryGetAll(
            'SELECT * FROM equipments'
        )
        
        return render_template('display_data/display_equipments_data.html', data=data)
    
# Equipments Data Page
@app.route('/equipments_data')
def display_equipments_data():
    try:
        data = mysql.queryGetAll(
            "SELECT * FROM equipments"
        )
        
        return render_template('display_data/display_equipments_data.html', data=data)
    
    except Exception as e:
        print("Error fetching data:", str(e))
        flash("Error fetching data. Please check the console for details.", 'danger')
        return redirect('/equipments_data')
    
# Operators Entry Page
@app.route('/operators', methods = ['POST', 'GET'])
def operators_entry():
    if request.method == 'GET':
        result = mysql.queryGet(
            "SELECT OperatorID FROM operators ORDER BY OperatorID DESC LIMIT 1"
        )

        latest_operator_id = result['OperatorID'] if result else None
        new_opeator_id = increment_id("O", latest_operator_id)
        
        result = mysql.queryGetAll(
            "SELECT CompanyID FROM company"
        )

        companies = [row['CompanyID'] for row in result]

        return render_template('forms/operators.html', latest_operator_id=new_opeator_id, companies=companies)
    
    elif request.method == 'POST':
        OperatorName = request.form['OperatorName']
        Occuption = request.form['Occupation']
        PhoneNumber = request.form['PhoneNumber']
        CompanyID = request.form['CompanyID']

        result = mysql.queryGet(
            "SELECT OperatorID FROM operators ORDER BY OperatorID DESC LIMIT 1"
        )

        latest_operator_id = result['OperatorID'] if result else None
        new_opeator_id = increment_id("O", latest_operator_id)

        mysql.querySet(
            "INSERT INTO operators VALUES(%s,%s,%s,%s,%s)",
            (new_opeator_id, OperatorName, Occuption, PhoneNumber, CompanyID)
        )

        data = mysql.queryGetAll(
            'SELECT * FROM operators'
        )
        
        return render_template('display_data/display_operators_data.html', data=data)

    
# Operators Data Page
@app.route('/operators_data')
def display_operators_data():
    try:
        data = mysql.queryGetAll(
            "SELECT * FROM operators"
        )

        return render_template('display_data/display_operators_data.html', data=data)
    
    except Exception as e:
        print("Error fetching data:", str(e))
        flash("Error fetching data. Please check the console for details.", 'danger')
        return redirect('/operators_data')

# Function to increment the retrieved IDs
def increment_id(prefix, id):
    if id is not None:
        num = id[-3:]

        num = int(num) + 1
        num = str(num).zfill(3)

        return prefix + num
    
    return prefix + '001'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
