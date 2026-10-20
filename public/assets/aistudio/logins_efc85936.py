from flask import Flask, request, redirect, url_for, session, render_template_string
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.secret_key = "estatehub_secret_key_2026"


# =========================================================
# MYSQL CONNECTION
# =========================================================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="property_ai"
    )


# =========================================================
# CREATE USERS TABLE
# =========================================================

def create_users_table():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('User', 'Broker', 'Admin') NOT NULL,
            phone VARCHAR(20),
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    cursor.close()
    conn.close()


# =========================================================
# CREATE / UPDATE DEMO ACCOUNTS
# =========================================================

def create_demo_users():

    conn = get_db_connection()
    cursor = conn.cursor()

    users = [
        ("Rahul Sharma", "user@estatehub.com", "user123", "User"),
        ("Amit Patil", "broker@estatehub.com", "broker123", "Broker"),
        ("EstateHub Admin", "admin@estatehub.com", "admin123", "Admin")
    ]

    for name, email, password, role in users:

        hashed_password = generate_password_hash(password)

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing = cursor.fetchone()

        if existing:

            cursor.execute(
                """
                UPDATE users
                SET name = %s,
                    password = %s,
                    role = %s,
                    status = 'Active'
                WHERE email = %s
                """,
                (name, hashed_password, role, email)
            )

        else:

            cursor.execute(
                """
                INSERT INTO users
                (name, email, password, role, status)
                VALUES (%s, %s, %s, %s, 'Active')
                """,
                (name, email, hashed_password, role)
            )

    conn.commit()

    cursor.close()
    conn.close()


# =========================================================
# CSS
# =========================================================

STYLE = """

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

body {
    background: #f4f7fb;
    color: #14213d;
}

/* LOGIN */

.login-page {
    min-height: 100vh;
    display: flex;
}

.login-left {
    width: 52%;
    min-height: 100vh;

    background:
        linear-gradient(
            rgba(7, 24, 45, 0.88),
            rgba(7, 24, 45, 0.75)
        ),
        url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90");

    background-size: cover;
    background-position: center;

    color: white;
    padding: 70px;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.logo {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 60px;
}

.logo span {
    color: #168cff;
}

.small-title {
    color: #50b5ff;
    letter-spacing: 4px;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
}

.login-left h1 {
    font-size: 55px;
    line-height: 1.05;
    margin-bottom: 25px;
}

.login-left h1 span {
    color: #168cff;
}

.login-left p {
    max-width: 600px;
    font-size: 18px;
    line-height: 1.7;
    color: #e4edf7;
}

.features {
    display: flex;
    gap: 25px;
    margin-top: 50px;
}

.feature {
    display: flex;
    align-items: center;
    gap: 10px;
}

.feature-icon {
    width: 45px;
    height: 45px;
    border: 1px solid #168cff;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.feature-text {
    font-size: 14px;
}

.feature-text span {
    display: block;
    color: #a9c0d8;
    margin-top: 4px;
}

/* LOGIN CARD */

.login-right {
    width: 48%;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 40px;
}

.login-card {
    width: 450px;
    background: white;
    padding: 45px;

    border-radius: 25px;

    box-shadow:
        0 20px 60px rgba(0,0,0,0.12);
}

.house-icon {
    width: 60px;
    height: 60px;

    border: 2px solid #168cff;
    border-radius: 15px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 30px;

    margin: 0 auto 20px;
}

.login-card h2 {
    text-align: center;
    font-size: 32px;
    margin-bottom: 8px;
}

.subtitle {
    text-align: center;
    color: #7b8798;
    margin-bottom: 30px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
}

.input-group input,
.input-group select {
    width: 100%;
    padding: 15px;

    border: 1px solid #d6dfe9;
    border-radius: 10px;

    font-size: 15px;
    outline: none;
    background: white;
}

.input-group input:focus,
.input-group select:focus {
    border-color: #168cff;
}

.login-button {
    width: 100%;
    padding: 15px;

    border: none;
    border-radius: 10px;

    background: #168cff;
    color: white;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;
}

.login-button:hover {
    background: #0875d1;
}

.error {
    background: #ffe9e9;
    color: #c53030;

    padding: 12px;
    border-radius: 9px;

    margin-bottom: 20px;

    text-align: center;
}

.security {
    text-align: center;
    margin-top: 25px;

    color: #8794a5;
    font-size: 12px;
}

/* NAVBAR */

.navbar {
    height: 72px;

    background: #10243d;
    color: white;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 35px;
}

.nav-logo {
    font-size: 28px;
    font-weight: bold;
}

.nav-logo span {
    color: #168cff;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-role {
    background: rgba(255,255,255,0.12);

    padding: 8px 16px;
    border-radius: 20px;

    font-size: 13px;
}

.logout {
    background: #ff4d4f;
    color: white;

    padding: 10px 18px;
    border-radius: 8px;

    text-decoration: none;
}

/* DASHBOARD */

.dashboard {
    padding: 40px;
}

.welcome {
    color: #68778b;
    margin-bottom: 25px;
}

.hero {
    color: white;

    padding: 40px;
    border-radius: 20px;

    margin-bottom: 30px;
}

.hero.user {
    background: linear-gradient(135deg, #1769aa, #168cff);
}

.hero.broker {
    background: linear-gradient(135deg, #00695c, #009688);
}

.hero.admin {
    background: linear-gradient(135deg, #17213c, #293f87);
}

.hero h1 {
    font-size: 34px;
    margin-bottom: 10px;
}

.hero p {
    font-size: 16px;
    opacity: 0.9;
}

.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
}

.card {
    background: white;

    padding: 28px;

    border-radius: 16px;

    box-shadow:
        0 8px 25px rgba(0,0,0,0.06);
}

.card-icon {
    font-size: 32px;
    margin-bottom: 15px;
}

.card h3 {
    margin-bottom: 10px;
}

.card p {
    color: #718096;
    line-height: 1.5;
}

@media (max-width: 900px) {

    .login-page {
        flex-direction: column;
    }

    .login-left,
    .login-right {
        width: 100%;
    }

    .login-left {
        min-height: auto;
        padding: 50px 30px;
    }

    .features {
        flex-direction: column;
    }

    .cards {
        grid-template-columns: 1fr;
    }
}

"""


# =========================================================
# LOGIN PAGE
# =========================================================

LOGIN_PAGE = """

<!DOCTYPE html>
<html>

<head>

<title>EstateHub Login</title>

<style>
{{ style|safe }}
</style>

</head>

<body>

<div class="login-page">

    <div class="login-left">

        <div class="logo">
            Estate<span>Hub</span>
        </div>

        <div class="small-title">
            FIND YOUR DREAM HOME
        </div>

        <h1>
            Better Homes.<br>
            <span>Bigger Dreams.</span>
        </h1>

        <p>
            Buy, sell or explore properties with ease.
            EstateHub brings users, brokers and property
            management together on one smart platform.
        </p>

        <div class="features">

            <div class="feature">
                <div class="feature-icon">✓</div>

                <div class="feature-text">
                    <b>Verified Properties</b>
                    <span>Trusted listings</span>
                </div>
            </div>

            <div class="feature">
                <div class="feature-icon">♙</div>

                <div class="feature-text">
                    <b>Trusted Brokers</b>
                    <span>Professional service</span>
                </div>
            </div>

            <div class="feature">
                <div class="feature-icon">🔒</div>

                <div class="feature-text">
                    <b>Secure Platform</b>
                    <span>Protected accounts</span>
                </div>
            </div>

        </div>

    </div>


    <div class="login-right">

        <div class="login-card">

            <div class="house-icon">
                🏠
            </div>

            <h2>
                Welcome Back
            </h2>

            <p class="subtitle">
                Login to your EstateHub account
            </p>

            {% if error %}

            <div class="error">
                {{ error }}
            </div>

            {% endif %}

            <form method="POST">

                <div class="input-group">

                    <label>Login As</label>

                    <select name="role" required>

                        <option value="">
                            Select Account Type
                        </option>

                        <option value="User">
                            👤 User
                        </option>

                        <option value="Broker">
                            🏢 Broker
                        </option>

                        <option value="Admin">
                            ⚙️ Admin
                        </option>

                    </select>

                </div>


                <div class="input-group">

                    <label>Email Address</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    >

                </div>


                <div class="input-group">

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    >

                </div>


                <button
                    type="submit"
                    class="login-button"
                >
                    Login
                </button>

            </form>

            <div class="security">
                🔒 Secure EstateHub Authentication
            </div>

        </div>

    </div>

</div>

</body>
</html>

"""


# =========================================================
# USER DASHBOARD
# =========================================================

USER_DASHBOARD = """

<!DOCTYPE html>
<html>

<head>

<title>EstateHub - User Dashboard</title>

<style>
{{ style|safe }}
</style>

</head>

<body>

<div class="navbar">

    <div class="nav-logo">
        Estate<span>Hub</span>
    </div>

    <div class="nav-right">

        <div class="nav-role">
            👤 User
        </div>

        <a class="logout" href="/logout">
            Logout
        </a>

    </div>

</div>


<div class="dashboard">

    <div class="welcome">
        Welcome back, {{ name }}
    </div>

    <div class="hero user">

        <h1>
            User Dashboard 👤
        </h1>

        <p>
            Explore properties and discover
            your next home with EstateHub.
        </p>

    </div>


    <div class="cards">

        <div class="card">

            <div class="card-icon">🏠</div>

            <h3>Browse Properties</h3>

            <p>
                Explore available properties
                and find homes matching your needs.
            </p>

        </div>


        <div class="card">

            <div class="card-icon">🔍</div>

            <h3>Search Properties</h3>

            <p>
                Search properties by location,
                type and requirements.
            </p>

        </div>


        <div class="card">

            <div class="card-icon">⭐</div>

            <h3>My Preferences</h3>

            <p>
                Manage your property preferences
                and requirements.
            </p>

        </div>

    </div>

</div>

</body>
</html>

"""


# =========================================================
# BROKER DASHBOARD
# =========================================================

BROKER_DASHBOARD = """

<!DOCTYPE html>
<html>

<head>

<title>EstateHub - Broker Dashboard</title>

<style>
{{ style|safe }}
</style>

</head>

<body>

<div class="navbar">

    <div class="nav-logo">
        Estate<span>Hub</span>
    </div>

    <div class="nav-right">

        <div class="nav-role">
            🏢 Broker
        </div>

        <a class="logout" href="/logout">
            Logout
        </a>

    </div>

</div>


<div class="dashboard">

    <div class="welcome">
        Welcome back, {{ name }}
    </div>

    <div class="hero broker">

        <h1>
            Broker Dashboard 🏢
        </h1>

        <p>
            Manage your property listings and
            connect with potential customers.
        </p>

    </div>


    <div class="cards">

        <div class="card">

            <div class="card-icon">🏠</div>

            <h3>My Properties</h3>

            <p>
                View and manage your property
                listings.
            </p>

        </div>


        <div class="card">

            <div class="card-icon">📋</div>

            <h3>Enquiries</h3>

            <p>
                View customer enquiries and
                property requests.
            </p>

        </div>


        <div class="card">

            <div class="card-icon">📊</div>

            <h3>Property Analytics</h3>

            <p>
                Monitor listing activity and
                property performance.
            </p>

        </div>

    </div>

</div>

</body>
</html>

"""


# =========================================================
# ADMIN DASHBOARD
# =========================================================

ADMIN_DASHBOARD = """

<!DOCTYPE html>
<html>

<head>

<title>EstateHub - Admin Dashboard</title>

<style>
{{ style|safe }}
</style>

</head>

<body>

<div class="navbar">

    <div class="nav-logo">
        Estate<span>Hub</span>
    </div>

    <div class="nav-right">

        <div class="nav-role">
            ⚙️ Admin
        </div>

        <a class="logout" href="/logout">
            Logout
        </a>

    </div>

</div>


<div class="dashboard">

    <div class="welcome">
        Welcome back, {{ name }}
    </div>

    <div class="hero admin">

        <h1>
            Admin Control Center 👑
        </h1>

        <p>
            Manage users, brokers, properties
            and the EstateHub platform.
        </p>

    </div>


    <div class="cards">

        <div class="card">
            <div class="card-icon">👥</div>
            <h3>Manage Users</h3>
            <p>
                View and manage registered
                EstateHub users.
            </p>
        </div>


        <div class="card">
            <div class="card-icon">🏠</div>
            <h3>Manage Properties</h3>
            <p>
                Review and manage property
                listings.
            </p>
        </div>


        <div class="card">
            <div class="card-icon">🏢</div>
            <h3>Manage Brokers</h3>
            <p>
                Manage broker accounts and
                property listings.
            </p>
        </div>


        <div class="card">
            <div class="card-icon">📊</div>
            <h3>Reports</h3>
            <p>
                View platform statistics
                and reports.
            </p>
        </div>


        <div class="card">
            <div class="card-icon">⚠️</div>
            <h3>Approvals</h3>
            <p>
                Review property listings
                requiring approval.
            </p>
        </div>


        <div class="card">
            <div class="card-icon">⚙️</div>
            <h3>Platform Settings</h3>
            <p>
                Configure EstateHub
                platform settings.
            </p>
        </div>

    </div>

</div>

</body>
</html>

"""


# =========================================================
# LOGIN ROUTE
# =========================================================

@app.route("/", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        selected_role = request.form.get("role", "")

        try:

            conn = get_db_connection()

            cursor = conn.cursor(dictionary=True)

            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    email,
                    password,
                    role
                FROM users
                WHERE email = %s
                AND status = 'Active'
                """,
                (email,)
            )

            user = cursor.fetchone()

            cursor.close()
            conn.close()

        except mysql.connector.Error as error:

            print("MYSQL ERROR:", error)

            return render_template_string(
                LOGIN_PAGE,
                style=STYLE,
                error="Database connection error."
            )


        # Check account

        if not user:

            return render_template_string(
                LOGIN_PAGE,
                style=STYLE,
                error="Invalid email or password."
            )


        # Check hashed password

        if not check_password_hash(
            user["password"],
            password
        ):

            return render_template_string(
                LOGIN_PAGE,
                style=STYLE,
                error="Invalid email or password."
            )


        # Check selected role

        if user["role"] != selected_role:

            return render_template_string(
                LOGIN_PAGE,
                style=STYLE,
                error="This account does not have the selected role."
            )


        # Create session

        session.clear()

        session["logged_in"] = True
        session["user_id"] = user["id"]
        session["name"] = user["name"]
        session["email"] = user["email"]
        session["role"] = user["role"]


        return redirect(
            url_for("dashboard")
        )


    return render_template_string(
        LOGIN_PAGE,
        style=STYLE,
        error=None
    )


# =========================================================
# COMMON DASHBOARD
# =========================================================

@app.route("/dashboard")
def dashboard():

    if not session.get("logged_in"):

        return redirect(
            url_for("login")
        )


    name = session.get("name")
    role = session.get("role")


    if role == "User":

        return render_template_string(
            USER_DASHBOARD,
            style=STYLE,
            name=name
        )


    if role == "Broker":

        return render_template_string(
            BROKER_DASHBOARD,
            style=STYLE,
            name=name
        )


    if role == "Admin":

        return render_template_string(
            ADMIN_DASHBOARD,
            style=STYLE,
            name=name
        )


    session.clear()

    return redirect(
        url_for("login")
    )


# =========================================================
# LOGOUT
# =========================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("login")
    )


# =========================================================
# START APPLICATION
# =========================================================

if __name__ == "__main__":

    try:

        create_users_table()
        create_demo_users()

        print()
        print("=" * 55)
        print("       ESTATEHUB REAL ESTATE PLATFORM")
        print("=" * 55)
        print()
        print("Database connected successfully.")
        print("Users table checked.")
        print("Demo accounts checked.")
        print()
        print("Website:")
        print("http://127.0.0.1:5000")
        print()
        print("=" * 55)

        app.run(
            host="127.0.0.1",
            port=5000,
            debug=True
        )

    except mysql.connector.Error as error:

        print()
        print("MYSQL ERROR")
        print(error)
        print()
        print("Check your MySQL server and password.")