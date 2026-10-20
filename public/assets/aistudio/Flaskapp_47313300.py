from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# =========================================================
# FLASK CONFIGURATION
# =========================================================

app.secret_key = "estatehub_secret_key_change_this"

CORS(app, supports_credentials=True)


# =========================================================
# MYSQL CONNECTION
# =========================================================

def get_db_connection():

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_MYSQL_PASSWORD",
        database="estatehub"
    )


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return """
    <h1>EstateHub Flask API</h1>
    <p>Backend is running successfully.</p>
    <p>Go to <a href="/login">Login</a></p>
    """


# =========================================================
# LOGIN PAGE
# =========================================================

@app.route("/login", methods=["GET"])
def login_page():

    return """
<!DOCTYPE html>
<html>

<head>

    <title>EstateHub Login</title>

    <style>

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f5f7fb;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .login-box {
            width: 380px;
            background: white;
            padding: 35px;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.1);
        }

        h1 {
            text-align: center;
            color: #2563eb;
        }

        p {
            text-align: center;
            color: #6b7280;
        }

        input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            box-sizing: border-box;
            border: 1px solid #d1d5db;
            border-radius: 8px;
        }

        button {
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }

        button:hover {
            background: #1d4ed8;
        }

        #message {
            text-align: center;
            margin-top: 15px;
            color: red;
        }

    </style>

</head>


<body>

<div class="login-box">

    <h1>🏠 EstateHub</h1>

    <p>Real Estate AI Platform</p>

    <input
        type="email"
        id="email"
        placeholder="Email"
    >

    <input
        type="password"
        id="password"
        placeholder="Password"
    >

    <button onclick="login()">
        Login
    </button>

    <div id="message"></div>

</div>


<script>

async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    if (!email || !password) {

        document.getElementById("message").innerText =
            "Please enter email and password.";

        return;
    }


    try {

        const response = await fetch(
            "/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (data.success) {

            window.location.href =
                data.dashboard;

        }

        else {

            document.getElementById("message").innerText =
                data.message;

        }

    }

    catch (error) {

        document.getElementById("message").innerText =
            "Unable to connect to server.";

        console.error(error);
    }

}

</script>

</body>

</html>
"""


# =========================================================
# LOGIN API
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Invalid request."
        }), 400


    email = data.get("email")
    password = data.get("password")


    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400


    try:

        db = get_db_connection()

        cursor = db.cursor(dictionary=True)


        query = """
        SELECT id, name, email, password, role
        FROM users
        WHERE email = %s
        """

        cursor.execute(query, (email,))

        user = cursor.fetchone()


        cursor.close()
        db.close()


        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        # Check password
        password_valid = check_password_hash(
            user["password"],
            password
        )


        if not password_valid:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        # Store login information
        session["user_id"] = user["id"]
        session["name"] = user["name"]
        session["email"] = user["email"]
        session["role"] = user["role"]


        # =================================================
        # ROLE BASED DASHBOARD
        # =================================================

        role = user["role"].lower()


        if role == "admin":

            dashboard = "http://localhost:8501"

        elif role == "seller" or role == "broker":

            dashboard = "http://localhost:8502"

        else:

            dashboard = "http://localhost:8503"


        return jsonify({
            "success": True,
            "message": "Login successful.",
            "name": user["name"],
            "role": user["role"],
            "dashboard": dashboard
        })


    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": f"Database error: {str(e)}"
        }), 500


# =========================================================
# CURRENT USER API
# =========================================================

@app.route("/api/me", methods=["GET"])
def current_user():

    if "user_id" not in session:

        return jsonify({
            "logged_in": False
        }), 401


    return jsonify({
        "logged_in": True,
        "user_id": session["user_id"],
        "name": session["name"],
        "email": session["email"],
        "role": session["role"]
    })


# =========================================================
# LOGOUT
# =========================================================

@app.route("/api/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    })


# =========================================================
# ADMIN DASHBOARD API
# =========================================================

@app.route("/api/admin/dashboard", methods=["GET"])
def admin_dashboard():

    if "user_id" not in session:

        return jsonify({
            "success": False,
            "message": "Please login first."
        }), 401


    if session["role"].lower() != "admin":

        return jsonify({
            "success": False,
            "message": "Admin access required."
        }), 403


    try:

        db = get_db_connection()

        cursor = db.cursor(dictionary=True)


        # Users
        cursor.execute(
            "SELECT COUNT(*) AS total FROM users"
        )

        total_users = cursor.fetchone()["total"]


        # Properties
        cursor.execute(
            "SELECT COUNT(*) AS total FROM properties"
        )

        total_properties = cursor.fetchone()["total"]


        # Bookings
        cursor.execute(
            "SELECT COUNT(*) AS total FROM bookings"
        )

        total_bookings = cursor.fetchone()["total"]


        # Pending properties
        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM properties
            WHERE status = 'pending'
            """
        )

        pending_properties = cursor.fetchone()["total"]


        cursor.close()
        db.close()


        return jsonify({

            "success": True,

            "dashboard": {

                "total_users": total_users,

                "total_properties": total_properties,

                "total_bookings": total_bookings,

                "pending_properties": pending_properties

            }

        })


    except mysql.connector.Error as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================================================
# PROTECTED TEST API
# =========================================================

@app.route("/api/protected", methods=["GET"])
def protected():

    if "user_id" not in session:

        return jsonify({
            "success": False,
            "message": "Unauthorized. Please login."
        }), 401


    return jsonify({

        "success": True,

        "message": "You are logged in.",

        "user": {
            "id": session["user_id"],
            "name": session["name"],
            "email": session["email"],
            "role": session["role"]
        }

    })


# =========================================================
# RUN FLASK
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )