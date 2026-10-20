import streamlit as st
from groq import Groq


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="EstateHub | Admin Dashboard",
    page_icon="🛡️",
    layout="wide"
)


# =========================================================
# PROFESSIONAL LIGHT THEME
# =========================================================

st.markdown("""
<style>

.stApp {
    background-color: #f5f7fb;
    color: #1f2937;
}

/* Sidebar */
[data-testid="stSidebar"] {
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
}

[data-testid="stSidebar"] p {
    color: #6b7280;
}

/* Headings */
h1, h2, h3, h4 {
    color: #111827 !important;
}

/* Dashboard title */
.dashboard-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
}

.dashboard-subtitle {
    color: #6b7280;
    font-size: 15px;
    margin-bottom: 25px;
}

/* Metric cards */
.metric-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.metric-number {
    font-size: 27px;
    font-weight: 700;
    color: #2563eb;
}

.metric-label {
    color: #6b7280;
    font-size: 14px;
}

/* Containers */
[data-testid="stVerticalBlockBorderWrapper"] {
    background-color: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 14px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
}

/* Buttons */
div.stButton > button {
    background-color: #2563eb !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
}

div.stButton > button:hover {
    background-color: #1d4ed8 !important;
}

/* Inputs */
input,
textarea {
    background-color: #ffffff !important;
    color: #1f2937 !important;
    border: 1px solid #d1d5db !important;
    border-radius: 8px !important;
}

/* Tables */
[data-testid="stDataFrame"] {
    background-color: white;
    border-radius: 10px;
}

/* Divider */
hr {
    border-color: #e5e7eb !important;
}

</style>
""", unsafe_allow_html=True)


# =========================================================
# SESSION STATE
# =========================================================

if "admin_logged_in" not in st.session_state:
    st.session_state.admin_logged_in = True

if "admin_chat_messages" not in st.session_state:
    st.session_state.admin_chat_messages = []


# =========================================================
# STATIC DATA
# =========================================================

users = [
    {
        "id": 1,
        "name": "Rahul Sharma",
        "email": "rahul@gmail.com",
        "role": "User",
        "status": "Active"
    },
    {
        "id": 2,
        "name": "Priya Patil",
        "email": "priya@gmail.com",
        "role": "User",
        "status": "Active"
    },
    {
        "id": 3,
        "name": "Amit Kulkarni",
        "email": "amit@gmail.com",
        "role": "Seller",
        "status": "Active"
    },
    {
        "id": 4,
        "name": "Neha Joshi",
        "email": "neha@gmail.com",
        "role": "User",
        "status": "Blocked"
    },
    {
        "id": 5,
        "name": "Vikram Mehta",
        "email": "vikram@gmail.com",
        "role": "Broker",
        "status": "Active"
    }
]


properties = [
    {
        "id": 101,
        "title": "Premium 2 BHK Apartment",
        "location": "Wakad, Pune",
        "price": 6500000,
        "type": "Apartment",
        "owner": "ABC Realty",
        "status": "Approved"
    },
    {
        "id": 102,
        "title": "Modern 3 BHK Apartment",
        "location": "Baner, Pune",
        "price": 9200000,
        "type": "Apartment",
        "owner": "Prime Properties",
        "status": "Approved"
    },
    {
        "id": 103,
        "title": "Luxury Villa",
        "location": "Hinjewadi, Pune",
        "price": 14500000,
        "type": "Villa",
        "owner": "Elite Homes",
        "status": "Pending"
    },
    {
        "id": 104,
        "title": "Affordable 1 BHK",
        "location": "Kharadi, Pune",
        "price": 4200000,
        "type": "Apartment",
        "owner": "City Homes",
        "status": "Pending"
    },
    {
        "id": 105,
        "title": "4 BHK Luxury Flat",
        "location": "Koregaon Park, Pune",
        "price": 18500000,
        "type": "Apartment",
        "owner": "Urban Developers",
        "status": "Approved"
    }
]


developers = [
    {
        "id": 1,
        "name": "ABC Developers",
        "city": "Pune",
        "projects": 8,
        "status": "Active"
    },
    {
        "id": 2,
        "name": "Urban Developers",
        "city": "Mumbai",
        "projects": 12,
        "status": "Active"
    },
    {
        "id": 3,
        "name": "Prime Buildtech",
        "city": "Pune",
        "projects": 5,
        "status": "Pending"
    },
    {
        "id": 4,
        "name": "Elite Infrastructure",
        "city": "Nashik",
        "projects": 7,
        "status": "Active"
    }
]


brokers = [
    {
        "id": 1,
        "name": "Vikram Mehta",
        "company": "Mehta Realty",
        "city": "Pune",
        "properties": 15,
        "status": "Active"
    },
    {
        "id": 2,
        "name": "Sneha Deshmukh",
        "company": "Deshmukh Properties",
        "city": "Mumbai",
        "properties": 11,
        "status": "Active"
    },
    {
        "id": 3,
        "name": "Rohan Shah",
        "company": "Shah Estate",
        "city": "Pune",
        "properties": 7,
        "status": "Pending"
    }
]


bookings = [
    {
        "id": "BK001",
        "user": "Rahul Sharma",
        "property": "Premium 2 BHK Apartment",
        "date": "2026-10-08",
        "type": "Property Visit",
        "status": "Pending"
    },
    {
        "id": "BK002",
        "user": "Priya Patil",
        "property": "Modern 3 BHK Apartment",
        "date": "2026-10-10",
        "type": "Online Meeting",
        "status": "Confirmed"
    },
    {
        "id": "BK003",
        "user": "Amit Kulkarni",
        "property": "Luxury Villa",
        "date": "2026-10-12",
        "type": "Property Visit",
        "status": "Pending"
    },
    {
        "id": "BK004",
        "user": "Neha Joshi",
        "property": "Affordable 1 BHK",
        "date": "2026-10-15",
        "type": "Property Visit",
        "status": "Cancelled"
    }
]


# =========================================================
# HELPER FUNCTION
# =========================================================

def format_price(price):
    return f"₹{price:,.0f}"


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.markdown("## 🏠 EstateHub")

    st.caption("Real Estate AI Platform")

    st.divider()

    menu = st.radio(
        "Admin Navigation",
        [
            "📊 Overview",
            "👥 Manage Users",
            "🏠 Manage Properties",
            "🏗️ Developers",
            "🤝 Brokers",
            "📅 Booking System",
            "🤖 AI Assistant",
            "🔮 Price Prediction",
            "⚙️ Settings"
        ]
    )

    st.divider()

    st.markdown("### 🛡️ Administrator")

    st.caption("Admin Account")

    if st.button("Logout", use_container_width=True):

        st.session_state.admin_logged_in = False
        st.rerun()


# =========================================================
# OVERVIEW
# =========================================================

if menu == "📊 Overview":

    st.markdown(
        '<div class="dashboard-title">Admin Dashboard</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="dashboard-subtitle">'
        'Manage users, properties, developers, brokers and bookings.'
        '</div>',
        unsafe_allow_html=True
    )

    # Metrics
    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">{len(users)}</div>
                <div class="metric-label">Total Users</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c2:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">{len(properties)}</div>
                <div class="metric-label">Properties</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c3:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">{len(developers)}</div>
                <div class="metric-label">Developers</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c4:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">{len(bookings)}</div>
                <div class="metric-label">Bookings</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.write("")

    # Second row
    c1, c2, c3, c4 = st.columns(4)

    pending_properties = len(
        [p for p in properties if p["status"] == "Pending"]
    )

    active_brokers = len(
        [b for b in brokers if b["status"] == "Active"]
    )

    active_developers = len(
        [d for d in developers if d["status"] == "Active"]
    )

    pending_bookings = len(
        [b for b in bookings if b["status"] == "Pending"]
    )

    with c1:
        st.metric("Pending Properties", pending_properties)

    with c2:
        st.metric("Active Developers", active_developers)

    with c3:
        st.metric("Active Brokers", active_brokers)

    with c4:
        st.metric("Pending Bookings", pending_bookings)

    st.divider()

    # Recent bookings
    st.subheader("📅 Recent Bookings")

    for booking in bookings[:4]:

        with st.container(border=True):

            col1, col2, col3 = st.columns([3, 3, 1])

            with col1:
                st.write(f"**{booking['id']}**")
                st.write(f"👤 {booking['user']}")

            with col2:
                st.write(f"🏠 {booking['property']}")
                st.caption(
                    f"📅 {booking['date']} • {booking['type']}"
                )

            with col3:

                if booking["status"] == "Confirmed":
                    st.success("Confirmed")

                elif booking["status"] == "Pending":
                    st.warning("Pending")

                else:
                    st.error("Cancelled")


# =========================================================
# MANAGE USERS
# =========================================================

elif menu == "👥 Manage Users":

    st.title("👥 Manage Users")

    st.caption("View and manage registered EstateHub users.")

    search = st.text_input(
        "🔎 Search Users",
        placeholder="Search by name or email..."
    )

    filtered_users = users

    if search:

        filtered_users = [
            u for u in users
            if search.lower() in u["name"].lower()
            or search.lower() in u["email"].lower()
        ]

    st.write(f"**{len(filtered_users)} users found**")

    for user in filtered_users:

        with st.container(border=True):

            col1, col2, col3 = st.columns([3, 3, 1])

            with col1:

                st.subheader(f"👤 {user['name']}")

                st.caption(f"User ID: {user['id']}")

            with col2:

                st.write(f"📧 {user['email']}")

                st.write(f"Role: **{user['role']}**")

            with col3:

                if user["status"] == "Active":
                    st.success("Active")
                else:
                    st.error("Blocked")

                if st.button(
                    "Manage",
                    key=f"user_{user['id']}"
                ):
                    st.info(f"Managing {user['name']}")


# =========================================================
# MANAGE PROPERTIES
# =========================================================

elif menu == "🏠 Manage Properties":

    st.title("🏠 Manage Properties")

    st.caption("Review, approve and manage property listings.")

    col1, col2 = st.columns(2)

    with col1:

        property_search = st.text_input(
            "🔎 Search Property",
            placeholder="Property or location..."
        )

    with col2:

        status_filter = st.selectbox(
            "Property Status",
            [
                "All",
                "Approved",
                "Pending",
                "Rejected"
            ]
        )

    filtered_properties = properties

    if property_search:

        filtered_properties = [
            p for p in filtered_properties
            if property_search.lower() in p["title"].lower()
            or property_search.lower() in p["location"].lower()
        ]

    if status_filter != "All":

        filtered_properties = [
            p for p in filtered_properties
            if p["status"] == status_filter
        ]

    st.write(f"**{len(filtered_properties)} properties found**")

    for property_data in filtered_properties:

        with st.container(border=True):

            col1, col2, col3 = st.columns([4, 2, 1])

            with col1:

                st.subheader(
                    f"🏠 {property_data['title']}"
                )

                st.write(
                    f"📍 {property_data['location']}"
                )

                st.write(
                    f"🏷️ {property_data['type']}"
                )

                st.write(
                    f"👤 Owner: {property_data['owner']}"
                )

            with col2:

                st.markdown(
                    f"### {format_price(property_data['price'])}"
                )

                if property_data["status"] == "Approved":
                    st.success("Approved")

                elif property_data["status"] == "Pending":
                    st.warning("Pending")

                else:
                    st.error("Rejected")

            with col3:

                if property_data["status"] == "Pending":

                    if st.button(
                        "✅ Approve",
                        key=f"approve_{property_data['id']}"
                    ):

                        property_data["status"] = "Approved"

                        st.success("Property approved.")
                        st.rerun()

                    if st.button(
                        "❌ Reject",
                        key=f"reject_{property_data['id']}"
                    ):

                        property_data["status"] = "Rejected"

                        st.error("Property rejected.")
                        st.rerun()

                else:

                    if st.button(
                        "Manage",
                        key=f"manage_property_{property_data['id']}"
                    ):

                        st.info("Property management opened.")


# =========================================================
# DEVELOPERS
# =========================================================

elif menu == "🏗️ Developers":

    st.title("🏗️ Manage Developers")

    st.caption(
        "Manage real estate developers and their projects."
    )

    if st.button("➕ Add Developer"):

        st.info(
            "Developer creation form can be connected to MySQL later."
        )

    search = st.text_input(
        "🔎 Search Developer",
        placeholder="Search developer or city..."
    )

    filtered_developers = developers

    if search:

        filtered_developers = [
            d for d in developers
            if search.lower() in d["name"].lower()
            or search.lower() in d["city"].lower()
        ]

    for developer in filtered_developers:

        with st.container(border=True):

            col1, col2, col3 = st.columns([4, 2, 1])

            with col1:

                st.subheader(
                    f"🏗️ {developer['name']}"
                )

                st.write(
                    f"📍 {developer['city']}"
                )

                st.write(
                    f"🏢 Projects: {developer['projects']}"
                )

            with col2:

                if developer["status"] == "Active":
                    st.success("Active")
                else:
                    st.warning("Pending")

            with col3:

                if st.button(
                    "Manage",
                    key=f"developer_{developer['id']}"
                ):

                    st.info(
                        f"Managing {developer['name']}"
                    )


# =========================================================
# BROKERS
# =========================================================

elif menu == "🤝 Brokers":

    st.title("🤝 Manage Brokers")

    st.caption(
        "Manage registered property brokers and agencies."
    )

    if st.button("➕ Add Broker"):

        st.info(
            "Broker registration form can be connected to MySQL later."
        )

    search = st.text_input(
        "🔎 Search Broker",
        placeholder="Search broker, company or city..."
    )

    filtered_brokers = brokers

    if search:

        filtered_brokers = [
            b for b in brokers
            if search.lower() in b["name"].lower()
            or search.lower() in b["company"].lower()
            or search.lower() in b["city"].lower()
        ]

    for broker in filtered_brokers:

        with st.container(border=True):

            col1, col2, col3 = st.columns([4, 2, 1])

            with col1:

                st.subheader(
                    f"🤝 {broker['name']}"
                )

                st.write(
                    f"🏢 {broker['company']}"
                )

                st.write(
                    f"📍 {broker['city']}"
                )

            with col2:

                st.write(
                    f"🏠 Properties: **{broker['properties']}**"
                )

                if broker["status"] == "Active":
                    st.success("Active")
                else:
                    st.warning("Pending")

            with col3:

                if st.button(
                    "Manage",
                    key=f"broker_{broker['id']}"
                ):

                    st.info(
                        f"Managing {broker['name']}"
                    )


# =========================================================
# BOOKING SYSTEM
# =========================================================

elif menu == "📅 Booking System":

    st.title("📅 Booking System")

    st.caption(
        "Monitor property visits, meetings and booking requests."
    )

    # Metrics
    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric(
            "Total Bookings",
            len(bookings)
        )

    with c2:
        st.metric(
            "Pending",
            len([
                b for b in bookings
                if b["status"] == "Pending"
            ])
        )

    with c3:
        st.metric(
            "Confirmed",
            len([
                b for b in bookings
                if b["status"] == "Confirmed"
            ])
        )

    with c4:
        st.metric(
            "Cancelled",
            len([
                b for b in bookings
                if b["status"] == "Cancelled"
            ])
        )

    st.divider()

    booking_filter = st.selectbox(
        "Filter Bookings",
        [
            "All",
            "Pending",
            "Confirmed",
            "Cancelled"
        ]
    )

    filtered_bookings = bookings

    if booking_filter != "All":

        filtered_bookings = [
            b for b in bookings
            if b["status"] == booking_filter
        ]

    for booking in filtered_bookings:

        with st.container(border=True):

            col1, col2, col3 = st.columns([3, 4, 2])

            with col1:

                st.subheader(
                    booking["id"]
                )

                st.write(
                    f"👤 {booking['user']}"
                )

            with col2:

                st.write(
                    f"🏠 **{booking['property']}**"
                )

                st.write(
                    f"📅 {booking['date']}"
                )

                st.caption(
                    f"Type: {booking['type']}"
                )

            with col3:

                if booking["status"] == "Pending":

                    st.warning("Pending")

                    if st.button(
                        "✅ Confirm",
                        key=f"confirm_{booking['id']}"
                    ):

                        booking["status"] = "Confirmed"

                        st.success(
                            "Booking confirmed."
                        )

                        st.rerun()

                elif booking["status"] == "Confirmed":

                    st.success("Confirmed")

                else:

                    st.error("Cancelled")


# =========================================================
# AI ASSISTANT
# =========================================================

elif menu == "🤖 AI Assistant":

    st.title("🤖 EstateHub AI Assistant")

    st.caption(
        "AI assistant for administration, properties, bookings, "
        "developers and brokers."
    )

    # Get Groq API key
    try:
        groq_api_key = st.secrets["GROQ_API_KEY"]
    except Exception:
        groq_api_key = None

    if not groq_api_key:

        st.warning(
            "Groq API key is not configured. "
            "Add GROQ_API_KEY to Streamlit secrets."
        )

        st.info(
            "For local testing, create .streamlit/secrets.toml "
            "and add your GROQ_API_KEY."
        )

    else:

        with st.container(border=True):

            st.subheader("💬 Ask EstateHub AI")

            st.write(
                "Ask questions about users, properties, "
                "bookings, developers and brokers."
            )

            # Quick questions
            st.write("### Quick Questions")

            q1, q2, q3 = st.columns(3)

            with q1:

                if st.button(
                    "📊 Platform Summary",
                    use_container_width=True
                ):

                    st.session_state.admin_chat_messages.append({
                        "role": "user",
                        "content":
                        "Give me a summary of the EstateHub platform."
                    })

            with q2:

                if st.button(
                    "🏠 Property Status",
                    use_container_width=True
                ):

                    st.session_state.admin_chat_messages.append({
                        "role": "user",
                        "content":
                        "Tell me about the current property status."
                    })

            with q3:

                if st.button(
                    "📅 Booking Status",
                    use_container_width=True
                ):

                    st.session_state.admin_chat_messages.append({
                        "role": "user",
                        "content":
                        "Give me a summary of current bookings."
                    })

            st.divider()

            # Display history
            for message in st.session_state.admin_chat_messages:

                with st.chat_message(message["role"]):

                    st.write(
                        message["content"]
                    )

            user_question = st.chat_input(
                "Ask the EstateHub Admin AI..."
            )

            if user_question:

                st.session_state.admin_chat_messages.append({
                    "role": "user",
                    "content": user_question
                })

                with st.chat_message("user"):

                    st.write(user_question)

                try:

                    client = Groq(
                        api_key=groq_api_key
                    )

                    system_prompt = f"""
You are EstateHub Admin AI Assistant.

EstateHub is a real estate management platform.

Current platform information:

Users: {len(users)}
Properties: {len(properties)}
Developers: {len(developers)}
Brokers: {len(brokers)}
Bookings: {len(bookings)}

Pending Properties:
{len([p for p in properties if p["status"] == "Pending"])}

Pending Bookings:
{len([b for b in bookings if b["status"] == "Pending"])}

Your responsibilities:

- Explain platform activity.
- Explain property management.
- Explain booking management.
- Explain user management.
- Explain developers and brokers.
- Give simple administrative suggestions.
- Summarize available platform data.
- Help identify pending items.

Rules:

- Do not claim to perform database changes.
- Do not claim a property was approved unless the application actually did it.
- Do not invent users or properties.
- Keep answers simple and professional.
"""

                    messages = [
                        {
                            "role": "system",
                            "content": system_prompt
                        }
                    ]

                    messages.extend(
                        st.session_state.admin_chat_messages
                    )

                    with st.chat_message("assistant"):

                        with st.spinner(
                            "AI is thinking..."
                        ):

                            response = client.chat.completions.create(
                                model="llama-3.3-70b-versatile",
                                messages=messages,
                                temperature=0.5
                            )

                            answer = (
                                response
                                .choices[0]
                                .message
                                .content
                            )

                            st.write(answer)

                    st.session_state.admin_chat_messages.append({
                        "role": "assistant",
                        "content": answer
                    })

                except Exception as e:

                    st.error(
                        f"Unable to connect to AI Assistant.\n\n"
                        f"Error: {e}"
                    )

            if st.button("🗑️ Clear Chat"):

                st.session_state.admin_chat_messages = []

                st.rerun()


# =========================================================
# PRICE PREDICTION
# =========================================================

elif menu == "🔮 Price Prediction":

    st.title("🔮 Property Price Prediction")

    st.caption(
        "Estimate the price of a property using its basic features."
    )

    with st.container(border=True):

        st.subheader(
            "🏠 Enter Property Details"
        )

        col1, col2, col3 = st.columns(3)

        with col1:

            area = st.number_input(
                "Area (sq.ft)",
                min_value=300,
                max_value=10000,
                value=1000,
                step=50
            )

        with col2:

            bedrooms = st.number_input(
                "Bedrooms",
                min_value=1,
                max_value=10,
                value=2,
                step=1
            )

        with col3:

            bathrooms = st.number_input(
                "Bathrooms",
                min_value=1,
                max_value=10,
                value=2,
                step=1
            )

        col1, col2, col3 = st.columns(3)

        with col1:

            location = st.selectbox(
                "Location Category",
                [
                    "Standard",
                    "Premium",
                    "Luxury"
                ]
            )

        with col2:

            property_type = st.selectbox(
                "Property Type",
                [
                    "Apartment",
                    "Villa",
                    "Independent House",
                    "Plot"
                ]
            )

        with col3:

            parking = st.number_input(
                "Parking Spaces",
                min_value=0,
                max_value=5,
                value=1,
                step=1
            )

        st.write("")

        if st.button(
            "🔮 Predict Property Price",
            use_container_width=True
        ):

            # Base price
            price_per_sqft = 6000

            # Location adjustment
            if location == "Premium":
                price_per_sqft = 8500

            elif location == "Luxury":
                price_per_sqft = 12000

            # Property type adjustment
            type_adjustment = 0

            if property_type == "Villa":
                type_adjustment = 1500000

            elif property_type == "Independent House":
                type_adjustment = 1000000

            elif property_type == "Plot":
                type_adjustment = -500000

            # Bedroom adjustment
            bedroom_adjustment = bedrooms * 200000

            # Bathroom adjustment
            bathroom_adjustment = bathrooms * 100000

            # Parking adjustment
            parking_adjustment = parking * 150000

            # Final estimation
            estimated_price = (
                area * price_per_sqft
                + bedroom_adjustment
                + bathroom_adjustment
                + parking_adjustment
                + type_adjustment
            )

            st.success(
                f"### Estimated Property Price: "
                f"₹{estimated_price:,.0f}"
            )

            st.divider()

            col1, col2, col3 = st.columns(3)

            with col1:

                st.metric(
                    "Area",
                    f"{area:,} sq.ft"
                )

            with col2:

                st.metric(
                    "Bedrooms",
                    bedrooms
                )

            with col3:

                st.metric(
                    "Price / sq.ft",
                    f"₹{price_per_sqft:,}"
                )

            st.info(
                "This is a demo estimation formula. "
                "For the final project, replace this formula "
                "with your trained ML model."
            )


# =========================================================
# SETTINGS
# =========================================================

elif menu == "⚙️ Settings":

    st.title("⚙️ Admin Settings")

    st.caption(
        "Manage administrator account and platform settings."
    )

    with st.container(border=True):

        st.subheader("👤 Admin Profile")

        name = st.text_input(
            "Admin Name",
            value="EstateHub Administrator"
        )

        email = st.text_input(
            "Admin Email",
            value="admin@estatehub.com"
        )

        if st.button(
            "Save Profile",
            use_container_width=True
        ):

            st.success(
                "Admin profile updated successfully."
            )

    st.write("")

    with st.container(border=True):

        st.subheader("🔐 Security")

        st.checkbox(
            "Enable login protection",
            value=True
        )

        st.checkbox(
            "Enable admin activity logging",
            value=True
        )

        st.checkbox(
            "Require property approval",
            value=True
        )

    st.write("")

    st.info(
        "This dashboard currently uses static data. "
        "It can later be connected to Flask APIs and MySQL."
    )