import streamlit as st
from groq import Groq
from datetime import date
import os
import re
import uuid


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="EstateHub | User Dashboard",
    page_icon="🏠",
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
    padding: 22px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.metric-number {
    font-size: 28px;
    font-weight: 700;
    color: #2563eb;
}

.metric-label {
    color: #6b7280;
    font-size: 14px;
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

/* Containers */
[data-testid="stVerticalBlockBorderWrapper"] {
    background-color: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 14px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
}

/* Inputs */
input,
textarea {
    background-color: #ffffff !important;
    color: #1f2937 !important;
    border: 1px solid #d1d5db !important;
    border-radius: 8px !important;
}

/* Chat */
[data-testid="stChatMessage"] {
    background-color: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 12px !important;
}

/* Divider */
hr {
    border-color: #e5e7eb !important;
}

</style>
""", unsafe_allow_html=True)


# =========================================================
# SESSION STATE INITIALIZATION
# =========================================================

if "logged_in" not in st.session_state:
    st.session_state.logged_in = True

if "bookings" not in st.session_state:
    st.session_state.bookings = []

if "documents" not in st.session_state:
    st.session_state.documents = []

if "user_chat_messages" not in st.session_state:
    st.session_state.user_chat_messages = []

if "selected_property" not in st.session_state:
    st.session_state.selected_property = None


# =========================================================
# SIMPLE LOGOUT / LOGIN
# =========================================================

if not st.session_state.logged_in:

    st.title("🏠 EstateHub")

    st.subheader("User Login")

    email = st.text_input("Email")
    password = st.text_input(
        "Password",
        type="password"
    )

    if st.button(
        "Login",
        use_container_width=True
    ):

        if email and password:

            st.session_state.logged_in = True
            st.rerun()

        else:

            st.error(
                "Please enter email and password."
            )

    st.stop()


# =========================================================
# PROPERTY DATA
# =========================================================

properties = [

    {
        "id": 1,
        "title": "Premium 2 BHK Apartment",
        "location": "Wakad, Pune",
        "price": 6500000,
        "area": "950 sq.ft",
        "bedrooms": 2,
        "bathrooms": 2,
        "seller": "ABC Realty"
    },

    {
        "id": 2,
        "title": "Modern 3 BHK Apartment",
        "location": "Baner, Pune",
        "price": 9200000,
        "area": "1350 sq.ft",
        "bedrooms": 3,
        "bathrooms": 3,
        "seller": "Prime Properties"
    },

    {
        "id": 3,
        "title": "Luxury Villa",
        "location": "Hinjewadi, Pune",
        "price": 14500000,
        "area": "2200 sq.ft",
        "bedrooms": 4,
        "bathrooms": 4,
        "seller": "Elite Homes"
    },

    {
        "id": 4,
        "title": "Affordable 1 BHK",
        "location": "Kharadi, Pune",
        "price": 4200000,
        "area": "650 sq.ft",
        "bedrooms": 1,
        "bathrooms": 1,
        "seller": "City Homes"
    }
]


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def format_price(price):
    return f"₹{price:,.0f}"


def safe_filename(filename):

    filename = os.path.basename(filename)

    filename = re.sub(
        r"[^a-zA-Z0-9._-]",
        "_",
        filename
    )

    unique_id = uuid.uuid4().hex[:8]

    name, extension = os.path.splitext(filename)

    return f"{name}_{unique_id}{extension}"


def get_groq_api_key():

    try:

        return st.secrets["GROQ_API_KEY"]

    except Exception:

        return None


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.markdown("## 🏠 EstateHub")

    st.caption(
        "Real Estate AI Platform"
    )

    st.divider()

    menu = st.radio(
        "Navigation",
        [
            "🏠 Dashboard",
            "🏘️ Properties",
            "📅 My Bookings",
            "📄 Documents",
            "🤖 AI Tools",
            "⚙️ Settings"
        ]
    )

    st.divider()

    st.write(
        "👤 **Yash Kondekar**"
    )

    st.caption(
        "User Account"
    )

    if st.button(
        "Logout",
        use_container_width=True
    ):

        st.session_state.logged_in = False

        st.session_state.bookings = []

        st.session_state.documents = []

        st.session_state.user_chat_messages = []

        st.session_state.selected_property = None

        st.rerun()


# =========================================================
# DASHBOARD
# =========================================================

if menu == "🏠 Dashboard":

    st.markdown(
        '<div class="dashboard-title">'
        'Welcome back! 👋'
        '</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        '<div class="dashboard-subtitle">'
        'Find properties, manage bookings and documents from one place.'
        '</div>',
        unsafe_allow_html=True
    )

    # Metrics

    c1, c2, c3, c4 = st.columns(4)

    with c1:

        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">
                    {len(properties)}
                </div>
                <div class="metric-label">
                    Available Properties
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c2:

        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">
                    {len(st.session_state.bookings)}
                </div>
                <div class="metric-label">
                    My Bookings
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c3:

        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-number">
                    {len(st.session_state.documents)}
                </div>
                <div class="metric-label">
                    Documents
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c4:

        st.markdown(
            """
            <div class="metric-card">
                <div class="metric-number">
                    AI
                </div>
                <div class="metric-label">
                    Assistant
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.write("")

    st.subheader(
        "🏘️ Featured Properties"
    )

    cols = st.columns(2)

    for index, property_data in enumerate(properties):

        with cols[index % 2]:

            with st.container(
                border=True
            ):

                st.subheader(
                    f"🏠 {property_data['title']}"
                )

                st.caption(
                    f"📍 {property_data['location']}"
                )

                st.markdown(
                    f"### {format_price(property_data['price'])}"
                )

                st.write(
                    f"📐 {property_data['area']}  |  "
                    f"🛏️ {property_data['bedrooms']} Beds  |  "
                    f"🛁 {property_data['bathrooms']} Baths"
                )

                st.write(
                    f"👤 Seller: {property_data['seller']}"
                )

                if st.button(
                    "View & Book",
                    key=f"dashboard_book_{property_data['id']}",
                    use_container_width=True
                ):

                    st.session_state.selected_property = (
                        property_data["id"]
                    )

                    st.info(
                        "Open the Properties section to complete booking."
                    )


# =========================================================
# PROPERTIES
# =========================================================

elif menu == "🏘️ Properties":

    st.title(
        "🏘️ Available Properties"
    )

    search = st.text_input(
        "🔎 Search Property",
        placeholder="Search by title or location..."
    )

    if search:

        filtered_properties = [

            p for p in properties

            if (
                search.lower()
                in p["title"].lower()
            )
            or (
                search.lower()
                in p["location"].lower()
            )
        ]

    else:

        filtered_properties = properties

    if not filtered_properties:

        st.info(
            "No properties found."
        )

    for property_data in filtered_properties:

        with st.container(
            border=True
        ):

            col1, col2 = st.columns(
                [3, 1]
            )

            with col1:

                st.subheader(
                    f"🏠 {property_data['title']}"
                )

                st.write(
                    f"📍 {property_data['location']}"
                )

                st.write(
                    f"📐 {property_data['area']}  |  "
                    f"🛏️ {property_data['bedrooms']} Beds  |  "
                    f"🛁 {property_data['bathrooms']} Baths"
                )

                st.write(
                    f"👤 Seller: {property_data['seller']}"
                )

                st.markdown(
                    f"### 💰 {format_price(property_data['price'])}"
                )

            with col2:

                if st.button(
                    "Book Property",
                    key=f"book_{property_data['id']}",
                    use_container_width=True
                ):

                    st.session_state.selected_property = (
                        property_data["id"]
                    )

                    st.rerun()

            # Booking form

            if (
                st.session_state.selected_property
                == property_data["id"]
            ):

                st.divider()

                st.subheader(
                    "📅 Book This Property"
                )

                visit_date = st.date_input(
                    "Preferred Visit Date",
                    min_value=date.today(),
                    key=f"date_{property_data['id']}"
                )

                visit_type = st.selectbox(
                    "Visit Type",
                    [
                        "Property Visit",
                        "Online Meeting"
                    ],
                    key=f"type_{property_data['id']}"
                )

                message = st.text_area(
                    "Message",
                    placeholder="Enter your message...",
                    key=f"message_{property_data['id']}"
                )

                col_a, col_b = st.columns(2)

                with col_a:

                    if st.button(
                        "Confirm Booking",
                        key=f"confirm_{property_data['id']}",
                        use_container_width=True
                    ):

                        booking = {

                            "id": uuid.uuid4().hex[:8],

                            "property": property_data["title"],

                            "location": property_data["location"],

                            "date": str(visit_date),

                            "type": visit_type,

                            "message": message,

                            "status": "Pending"
                        }

                        st.session_state.bookings.append(
                            booking
                        )

                        # Clear selected property

                        st.session_state.selected_property = None

                        st.success(
                            "Property booking submitted successfully!"
                        )

                        st.rerun()

                with col_b:

                    if st.button(
                        "Cancel",
                        key=f"cancel_{property_data['id']}",
                        use_container_width=True
                    ):

                        st.session_state.selected_property = None

                        st.rerun()


# =========================================================
# MY BOOKINGS
# =========================================================

elif menu == "📅 My Bookings":

    st.title(
        "📅 My Bookings"
    )

    if not st.session_state.bookings:

        st.info(
            "You don't have any property bookings yet."
        )

    else:

        for booking in st.session_state.bookings:

            with st.container(
                border=True
            ):

                col1, col2 = st.columns(
                    [4, 1]
                )

                with col1:

                    st.subheader(
                        f"🏠 {booking['property']}"
                    )

                    st.write(
                        f"📍 {booking['location']}"
                    )

                    st.write(
                        f"📅 {booking['date']}"
                    )

                    st.write(
                        f"Type: {booking['type']}"
                    )

                    if booking["message"]:

                        st.write(
                            f"Message: {booking['message']}"
                        )

                with col2:

                    st.success(
                        booking["status"]
                    )


# =========================================================
# DOCUMENTS
# =========================================================

elif menu == "📄 Documents":
    st.title("📄 Property Documents")
    st.caption("Search properties and manage their related documents.")

    # ---------------------------------------------------------
    # PROPERTY SEARCH
    # ---------------------------------------------------------
    st.subheader("🔎 Search Property")

    property_search = st.text_input(
        "Search by property name or location",
        placeholder="Example: Wakad, Baner, 2 BHK..."
    )

    if property_search:
        matching_properties = [
            p for p in properties
            if property_search.lower() in p["title"].lower()
            or property_search.lower() in p["location"].lower()
        ]
    else:
        matching_properties = properties

    if not matching_properties:
        st.warning("No matching properties found.")
        st.stop()

    # ---------------------------------------------------------
    # SELECT PROPERTY
    # ---------------------------------------------------------
    property_options = {
        f"{p['title']} — {p['location']}": p
        for p in matching_properties
    }

    selected_property_name = st.selectbox(
        "🏠 Select Property",
        list(property_options.keys())
    )

    selected_property = property_options[selected_property_name]

    # ---------------------------------------------------------
    # PROPERTY INFORMATION
    # ---------------------------------------------------------
    with st.container(border=True):
        st.subheader(f"🏠 {selected_property['title']}")

        col1, col2, col3 = st.columns(3)

        with col1:
            st.write(f"📍 **Location:** {selected_property['location']}")

        with col2:
            st.write(f"📐 **Area:** {selected_property['area']}")

        with col3:
            st.write(f"💰 **Price:** {format_price(selected_property['price'])}")

        st.write(
            f"🛏️ {selected_property['bedrooms']} Bedrooms  |  "
            f"🛁 {selected_property['bathrooms']} Bathrooms"
        )

        st.write(f"👤 **Seller:** {selected_property['seller']}")

    st.divider()

    # ---------------------------------------------------------
    # UPLOAD DOCUMENT
    # ---------------------------------------------------------
    st.subheader("📤 Upload Property Document")

    document_type = st.selectbox(
        "Document Type",
        [
            "Property Agreement",
            "Ownership Document",
            "Sale Deed",
            "Property Brochure",
            "Floor Plan",
            "Other"
        ]
    )

    uploaded_file = st.file_uploader(
        "Select PDF Document",
        type=["pdf"],
        key=f"upload_{selected_property['id']}"
    )

    if uploaded_file:
        st.info(f"Selected file: **{uploaded_file.name}**")

        if st.button(
            "📤 Upload Document",
            use_container_width=True,
            key=f"upload_button_{selected_property['id']}"
        ):

            os.makedirs("uploads", exist_ok=True)

            safe_name = safe_filename(uploaded_file.name)

            file_path = os.path.join(
                "uploads",
                safe_name
            )

            with open(file_path, "wb") as file:
                file.write(uploaded_file.getbuffer())

            st.session_state.documents.append({
                "id": uuid.uuid4().hex[:8],
                "property_id": selected_property["id"],
                "property": selected_property["title"],
                "location": selected_property["location"],
                "file_name": uploaded_file.name,
                "stored_name": safe_name,
                "type": document_type
            })

            st.success(
                f"Document uploaded successfully for "
                f"{selected_property['title']}!"
            )

            st.rerun()

    st.divider()

    # ---------------------------------------------------------
    # SEARCH UPLOADED DOCUMENTS
    # ---------------------------------------------------------
    st.subheader("📚 Property Documents")

    document_search = st.text_input(
        "🔎 Search uploaded documents",
        placeholder="Search by document name or document type..."
    )

    selected_property_id = selected_property["id"]

    property_documents = [
        document
        for document in st.session_state.documents
        if document.get("property_id") == selected_property_id
    ]

    if document_search:
        property_documents = [
            document
            for document in property_documents
            if document_search.lower() in document["file_name"].lower()
            or document_search.lower() in document["type"].lower()
        ]

    # ---------------------------------------------------------
    # DISPLAY DOCUMENTS
    # ---------------------------------------------------------
    if not property_documents:

        st.info(
            f"No documents found for "
            f"**{selected_property['title']}**."
        )

    else:

        st.write(
            f"**{len(property_documents)} document(s) found**"
        )

        for document in property_documents:

            with st.container(border=True):

                col1, col2 = st.columns([4, 1])

                with col1:

                    st.subheader(
                        f"📄 {document['file_name']}"
                    )

                    st.write(
                        f"🏠 **Property:** "
                        f"{document['property']}"
                    )

                    st.write(
                        f"📍 **Location:** "
                        f"{document['location']}"
                    )

                    st.write(
                        f"📑 **Type:** "
                        f"{document['type']}"
                    )

                with col2:

                    file_path = os.path.join(
                        "uploads",
                        document["stored_name"]
                    )

                    if os.path.exists(file_path):

                        with open(file_path, "rb") as file:

                            st.download_button(
                                "⬇️ Download",
                                file,
                                file_name=document["file_name"],
                                mime="application/pdf",
                                key=f"download_{document['id']}",
                                use_container_width=True
                            )
                    else:
                        st.error("File not found.")
# =========================================================
# AI TOOLS
# =========================================================

elif menu == "🤖 AI Tools":

    st.title(
        "🤖 Real Estate AI Tools"
    )

    st.caption(
        "Smart tools for property analysis and real estate assistance."
    )

    st.divider()

    # =====================================================
    # PROPERTY PRICE PREDICTION
    # =====================================================

    st.subheader(
        "🏠 Property Price Prediction"
    )

    with st.container(
        border=True
    ):

        st.write(
            "Enter basic property details to generate an estimated price."
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

            location_factor = st.selectbox(
                "Location Category",
                [
                    "Standard",
                    "Premium",
                    "Luxury"
                ]
            )

        if st.button(
            "🔮 Estimate Property Price",
            use_container_width=True
        ):

            # Simple transparent estimation formula
            # Replace this with your trained ML model later.

            base_price = area * 6500

            bedroom_adjustment = (
                bedrooms * 200000
            )

            if location_factor == "Premium":

                location_adjustment = 1500000

            elif location_factor == "Luxury":

                location_adjustment = 3500000

            else:

                location_adjustment = 0

            estimated_price = (
                base_price
                + bedroom_adjustment
                + location_adjustment
            )

            st.success(
                f"Estimated Property Price: "
                f"₹{estimated_price:,.0f}"
            )

            st.caption(
                "This is an estimated value based on the "
                "entered property details. Replace this formula "
                "with your trained ML model for production use."
            )

    st.divider()

    # =====================================================
    # GROQ REAL ESTATE CHATBOT
    # =====================================================

    st.subheader(
        "💬 Real Estate AI Assistant"
    )

    st.write(
        "Ask questions about property prices, buying, selling, "
        "investment concepts and property documentation."
    )

    with st.container(
        border=True
    ):

        # Get API key from Streamlit secrets

        groq_api_key = get_groq_api_key()

        if groq_api_key:

            st.success(
                "AI Assistant is ready."
            )

        else:

            st.warning(
                "Groq API key is not configured. "
                "Add GROQ_API_KEY to Streamlit secrets."
            )

        col1, col2 = st.columns(
            [5, 1]
        )

        with col2:

            if st.button(
                "🗑️ Clear Chat",
                use_container_width=True
            ):

                st.session_state.user_chat_messages = []

                st.rerun()

        st.write("")

        # Display previous messages

        for message in st.session_state.user_chat_messages:

            with st.chat_message(
                message["role"]
            ):

                st.write(
                    message["content"]
                )

        # Chat input

        user_question = st.chat_input(
            "Ask about property prices, buying, selling..."
        )

        if user_question:

            if not groq_api_key:

                st.error(
                    "AI Assistant is unavailable because "
                    "the Groq API key is not configured."
                )

            else:

                try:

                    client = Groq(
                        api_key=groq_api_key
                    )

                    # Save user message

                    st.session_state.user_chat_messages.append({
                        "role": "user",
                        "content": user_question
                    })

                    with st.chat_message(
                        "user"
                    ):

                        st.write(
                            user_question
                        )

                    # System instructions

                    messages = [

                        {
                            "role": "system",

                            "content": """
You are EstateHub's Real Estate AI Assistant.

Help users with:

- Property information
- Property price concepts
- Buying and selling guidance
- Real estate investment concepts
- Property market concepts
- General home-loan information
- Property documentation guidance

Give simple, clear and useful answers.

Do not claim access to live property listings,
private user information, or real-time market data
unless that information is explicitly provided.

Do not provide legal or financial advice as a
definitive professional opinion. Recommend consulting
a qualified professional when appropriate.

If a question is unrelated to real estate,
politely explain that you specialize in real estate assistance.
"""
                        }

                    ]

                    messages.extend(
                        st.session_state.user_chat_messages
                    )

                    with st.chat_message(
                        "assistant"
                    ):

                        with st.spinner(
                            "Analyzing your question..."
                        ):

                            response = client.chat.completions.create(

                                model="llama-3.3-70b-versatile",

                                messages=messages,

                                temperature=0.7
                            )

                            answer = (
                                response
                                .choices[0]
                                .message
                                .content
                            )

                            st.write(
                                answer
                            )

                    # Save assistant response

                    st.session_state.user_chat_messages.append({

                        "role": "assistant",

                        "content": answer
                    })

                except Exception as e:

                    st.error(
                        "Unable to connect to the AI Assistant. "
                        "Please check the Groq configuration."
                    )


# =========================================================
# SETTINGS
# =========================================================

elif menu == "⚙️ Settings":

    st.title(
        "⚙️ Account Settings"
    )

    name = st.text_input(
        "Full Name",
        value="Yash Kondekar"
    )

    email = st.text_input(
        "Email",
        value="user@example.com"
    )

    if st.button(
        "Save Changes",
        use_container_width=True
    ):

        st.success(
            "Settings saved successfully."
        )

    st.info(
        "User settings can be connected to your Flask/MySQL "
        "database when backend integration is added."
    )