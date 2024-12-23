from flask import Flask, render_template, request, redirect, flash, session, jsonify, make_response
from datetime import datetime
from database import MySQLDatabase
from backend import increment_id, encrypt
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

    [X]TODO: pass the data for equipments, operators, energy from the database to home


'''

'''
NOTES TO SELF:
    [/]TODO: Integrate Database object so it looks cleaner and organized.
    
    [x]TODO: Simplify and organize code. (Nothing wrong with making another Python file to organize the code more).
       Reason: Seems like flask_mysqldb has some issues with database connections if on a separate file as it's trying
       to find an active AppContext object thing. idk. it just doesnt work.
'''

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
        if request.endpoint not in ['static', 'login', 'signup']:
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
    return redirect('/dashboard')

# Login Page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if session['user']:
        return redirect('/dashboard')
    
    else:
        if request.method == 'GET':
            return render_template('login.html')
        
        elif request.method == 'POST':
            username = request.form.get('username')
            password = encrypt(request.form.get('password'))

            if username not in session['username_list']:
                flash(f"User \"{username}\" not found in database. Try signing up.", 'warning')
            else:
                userPassword = mysql.queryGet(
                    'SELECT HEX(Password) AS Password FROM auth WHERE UserName = %s',
                    (username,)
                )

                if password != userPassword['Password'].lower():
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
        return render_template('signup.html')
    
    elif request.method == 'POST':
        username = request.form.get('username')
        password = encrypt(request.form.get('password'))

        if username in session['username_list']:
            flash(f'User "{username}" already exists.', 'danger')
            return redirect('/signup')

        else:
            if mysql.queryGet('SELECT * FROM auth WHERE UserName = %s',(username,)):
                flash(f'User "{username}" already exists.', 'danger')
                return redirect('/signup')
            else:
                mysql.querySet(
                    'INSERT INTO auth (UserName, Password) VALUES (%s, UNHEX(%s))',
                    (username, password)
                )
                flash("Registration successful! You can now log in with your new account.", 'success')
                return redirect('/login')

# Home Page Rendering
@app.route('/dashboard')
def home_page():
    return render_template('dashboard.html', flash=flash)

# Home Page Searching
@app.route('/search_equipment', methods=['GET'])
def search_equipment():
    equipment_name = request.args.get('equipment_name')
    if equipment_name == '':
        flash("Please enter a search query.", 'warning')
        return redirect('/dashboard')

    equipments = mysql.queryGetAll('SELECT equipments.*, CompanyName FROM equipments, company WHERE EquipmentName LIKE %s AND equipments.CompanyID=company.CompanyID', 
                ("%" + equipment_name + "%",)
                )

    if equipments == ():
        flash(f"No equipment(s) found for search query: '{equipment_name}'.", 'info')
        return redirect('/dashboard')
    
    return render_template('search_results.html', equipments=equipments)

# Global data fetching endpoint
@app.route('/fetch')
def fetch():
    if request.method == 'GET':
        match list(request.args.keys())[0]:
            case 'equipments':
                if "id" in request.args.keys():
                    equipments = mysql.queryGet(
                        "SELECT * FROM equipments WHERE EquipmentID=%s",
                        (request.args['id'],)
                    )

                else:
                    equipments = mysql.queryGetAll(
                        'SELECT * FROM equipments'
                    )

                return jsonify(equipments)
            
            case 'operators':
                if "id" in request.args.keys():
                    operators = mysql.queryGet(
                        "SELECT O.*, C.CompanyName FROM operators O, company C WHERE O.CompanyID=C.CompanyID AND O.OperatorID=%s;",
                        (request.args['id'],)
                    )
                
                else:
                    operators = mysql.queryGetAll(
                        "SELECT O.*, C.CompanyName FROM operators O, company C WHERE O.CompanyID=C.CompanyID;"
                    )

                return jsonify(operators)
            
            case 'companies':
                if "id" in request.args.keys():
                    companies = mysql.queryGet(
                        "SELECT * FROM company WHERE CompanyID=%s",
                        (request.args['id'],)
                    )
                    
                else:
                    companies = mysql.queryGetAll(
                        "SELECT * FROM company"
                    )

                return jsonify(companies)
            
            case 'energy':
                energy_usage = mysql.queryGetAll(
                    "SELECT E.EquipmentID, E.EquipmentName, SUM(A.EnergyConsumed) AS EnergyConsumed FROM logs A , equipments E WHERE A.EquipmentID=E.EquipmentID GROUP BY E.EquipmentID;"
                )

                return jsonify(energy_usage)

            case 'logs':
                logs = mysql.queryGetAll(
                    'SELECT A.*, E.EquipmentName, O.OperatorName FROM logs A, equipments E, operators O WHERE A.EquipmentID=E.EquipmentID AND A.OperatorID=O.OperatorID;'
                )

                return jsonify(logs)
            
            case _:
                return jsonify({'Error': 404, 'Reason': f"Unknown parameter '{list(request.args.keys())[0]}'"})

# Global data add enpoint
@app.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        match list(request.args.keys())[0]:
            case "log":
                equipment_id = request.args['id']

                OperatorID = request.args['o_id']
                EnergyConsumed = request.args['e_con']
                TimeStamp = datetime.now()

                PowerRating = mysql.queryGet(
                    "SELECT PowerRating FROM equipments WHERE EquipmentID=%s",
                    (equipment_id,)
                )['PowerRating']

                EnergyConsumed = str(int(EnergyConsumed) + int(PowerRating))

                result = mysql.queryGet(
                    "SELECT AlertID FROM logs ORDER BY AlertID DESC LIMIT 1"
                )

                latest_alert_id = result['AlertID'] if result else None
                new_alert_id = increment_id("AL", latest_alert_id)

                mysql.querySet(
                    "INSERT INTO logs VALUES(%s,%s,%s,%s,%s)",
                    (new_alert_id, equipment_id, OperatorID, EnergyConsumed, TimeStamp)
                )

                return {'successful': True}
            
            case "company":
                CompanyName = request.args['name']
                Location = request.args['location']
                Contact = request.args['contact']

                result = mysql.queryGet(
                    "SELECT CompanyID FROM company ORDER BY CompanyID DESC LIMIT 1"
                )

                latest_company_id = result['CompanyID'] if result else None
                new_company_id = increment_id("C", latest_company_id)

                mysql.querySet(
                    "INSERT INTO company VALUES(%s,%s,%s,%s)",
                    (new_company_id,CompanyName, Location, Contact)
                )

                return {'successful': True}
            
            case "equipment":
                EquipmentName = request.args['name']
                PowerRating = request.args['rating']
                ManufacturingDate = request.args['date']
                CompanyID = request.args['company']     

                result = mysql.queryGet(
                    "SELECT EquipmentID FROM equipments ORDER BY EquipmentID DESC LIMIT 1"
                )
                
                latest_equipment_id = result['EquipmentID'] if result else None
                new_equipment_id = increment_id("E", latest_equipment_id)

                mysql.querySet(
                    "INSERT INTO equipments VALUES(%s,%s,%s,%s,%s)",
                    (new_equipment_id, EquipmentName, PowerRating, ManufacturingDate, CompanyID)
                )

                return {'successful': True}
            
            case "operator":
                OperatorName = request.args['name']
                Occupation = request.args['occupation']
                PhoneNumber = request.args['number']
                CompanyID = request.args['c_id']

                result = mysql.queryGet(
                    "SELECT OperatorID FROM operators ORDER BY OperatorID DESC LIMIT 1"
                )

                latest_operator_id = result['OperatorID'] if result else None
                new_opeator_id = increment_id("O", latest_operator_id)

                mysql.querySet(
                    "INSERT INTO operators VALUES(%s,%s,%s,%s,%s)",
                    (new_opeator_id, OperatorName, Occupation, PhoneNumber, CompanyID)
                )

                return {'successful': True}
            
            case _:
                return jsonify({'Error': 404, 'Reason': f"Unknown parameter '{list(request.args.keys())[0]}'"})

# Global data edit enpoint
@app.route('/edit', methods=['POST'])
def edit():
    if request.method == 'POST':
        match list(request.args.keys())[0]:
            case "company":
                CompanyID = request.args['id']
                CompanyName = request.args['name']
                Location = request.args['location']
                Contact = request.args['contact']

                # Fetch pre-exisitng data first if some queries are left empty
                existing_data = mysql.queryGet(
                    "SELECT CompanyName, Location, Contact FROM company WHERE CompanyID=%s",
                    (CompanyID,)
                )

                CompanyName = existing_data['CompanyName'] if CompanyName == '' else CompanyName
                Location = existing_data['Location'] if Location == '' else Location
                Contact = existing_data['Contact'] if Contact == '' else Contact

                mysql.querySet(
                    "UPDATE company SET CompanyName=%s,Location=%s,Contact=%s WHERE CompanyID=%s",
                    (CompanyName, Location, Contact, CompanyID)
                )

                return {'successful': True}
            
            case "equipment":
                EquipmentID = request.args['id']
                EquipmentName = request.args['name']
                PowerRating = request.args['rating']
                ManufacturingDate = request.args['date']
                CompanyID = request.args['company']     

                existing_data = mysql.queryGet(
                    "SELECT EquipmentName, PowerRating, ManufacturingDate, CompanyID FROM equipments WHERE EquipmentID=%s",
                    (EquipmentID,)
                )

                EquipmentName = existing_data['EquipmentName'] if EquipmentName == '' else EquipmentName
                PowerRating = existing_data['PowerRating'] if PowerRating == '' else PowerRating
                ManufacturingDate = existing_data['ManufacturingDate'] if ManufacturingDate == '' else ManufacturingDate
                CompanyID = existing_data['CompanyID'] if CompanyID == '' else CompanyID

                mysql.querySet(
                    "UPDATE equipments SET EquipmentName=%s,PowerRating=%s,ManufacturingDate=%s,CompanyID=%s WHERE EquipmentID=%s",
                    (EquipmentName, PowerRating, ManufacturingDate, CompanyID, EquipmentID)
                )

                return {'successful': True}
            
            case "operator":
                OperatorID = request.args['id']
                OperatorName = request.args['name']
                Occupation = request.args['occupation']
                PhoneNumber = request.args['number']
                CompanyID = request.args['c_id']

                existing_data = mysql.queryGet(
                    "SELECT OperatorName, Occupation, PhoneNumber, CompanyID FROM operators WHERE OperatorID=%s",
                    (OperatorID,)
                )

                OperatorName = existing_data['OperatorName'] if OperatorName == '' else OperatorName
                Occupation = existing_data['Occupation'] if Occupation == '' else Occupation
                PhoneNumber = existing_data['PhoneNumber'] if PhoneNumber == '' else PhoneNumber
                CompanyID = existing_data['CompanyID'] if CompanyID == '' else CompanyID

                mysql.querySet(
                    "UPDATE operators SET OperatorName=%s,Occupation=%s,PhoneNumber=%s,CompanyID=%s WHERE OperatorID=%s",
                    (OperatorName, Occupation, PhoneNumber, CompanyID, OperatorID)
                )

                return {'succesful': True}
            
            case _:
                return jsonify({'Error': 404, 'Reason': f"Unknown parameter '{list(request.args.keys())[0]}'"})

# Global data delete enpoint
@app.route('/delete', methods=['POST'])
def delete():
    if request.method == 'POST':
        match list(request.args.keys())[0]:
            case "log":
                AlertID = request.args['id']
                
                mysql.querySet(
                    "DELETE FROM logs WHERE AlertID=%s",
                    (AlertID,)
                )

                return {'successful': True}
            
            case "company":
                CompanyID = request.args['id']

                mysql.querySet(
                    "DELETE FROM company WHERE CompanyID=%s",
                    (CompanyID,)
                )

                return {'successful': True}
            
            case "equipment":
                EquipmentID = request.args['id']

                mysql.querySet(
                    "DELETE FROM equipments WHERE EquipmentID=%s",
                    (EquipmentID,)
                )

                return {'successful': True}
            
            case "operator":
                OperatorID = request.args['id']

                mysql.querySet(
                    "DELETE FROM operators WHERE OperatorID=%s",
                    (OperatorID,)
                )

                return {'succesful': True}
            
            case _:
                return jsonify({'Error': 404, 'Reason': f"Unknown parameter '{list(request.args.keys())[0]}'"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
