from config import get_db_connection
from datetime import datetime

def generate_user_id(first_name, last_name):
    current_month_year = datetime.now().strftime('%m%y')  # Get current month and year (MMYY)
    return first_name[:2].upper() + last_name[:2].upper() + current_month_year

# Function to create a user (Admin, Faculty, or Student)
def create_user(data, role):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Extract data from request payload
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        # Generate a unique UserID
        user_id = generate_user_id(first_name, last_name)

        # Check if the user is already in the system (by email or user ID)
        cursor.execute("SELECT * FROM Users WHERE Email = %s OR UserID = %s", (email, user_id))
        existing_user = cursor.fetchone()
        if existing_user:
            return False, "A user with this email or UserID already exists."

        # Insert into the Users table
        cursor.execute("""
            INSERT INTO Users (UserID, FirstName, LastName, Email, Password)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, first_name, last_name, email, password))

        # Insert into the corresponding role table
        if role == 'admin':
            cursor.execute("INSERT INTO Admins (UserID) VALUES (%s)", (user_id,))
        elif role == 'faculty':
            cursor.execute("INSERT INTO Faculties (UserID) VALUES (%s)", (user_id,))
        elif role == 'student':
            cursor.execute("INSERT INTO Students (UserID) VALUES (%s)", (user_id,))
        else:
            connection.rollback()  # Rollback transaction if role is invalid
            return False, "Invalid role specified."

        # Commit the transaction
        connection.commit()

        return True, f"{role.capitalize()} account created successfully with UserID: {user_id}"
    
    except Exception as e:
        # Rollback in case of any errors
        connection.rollback()
        return False, str(e)
    
    finally:
        # Close cursor and connection
        cursor.close()
        connection.close()


# Query to check user login and retrieve role
def get_user_by_credentials(user_id, password):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT UserID, FirstName, LastName 
        FROM Users 
        WHERE UserID = %s AND Password = %s
    """
    cursor.execute(query, (user_id, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user

def check_admin_role(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT UserID FROM Admins WHERE UserID = %s", (user_id,))
    is_admin = cursor.fetchone()
    cursor.close()
    connection.close()
    return is_admin is not None

def check_faculty_role(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT UserID FROM Faculties WHERE UserID = %s", (user_id,))
    is_faculty = cursor.fetchone()
    cursor.close()
    connection.close()
    return is_faculty is not None

def check_student_role(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT UserID FROM Students WHERE UserID = %s", (user_id,))
    is_student = cursor.fetchone()
    cursor.close()
    connection.close()
    return is_student is not None

def create_etextbook_query(data):
    title = data.get('title')
    eTextbookID = data.get('eTextbookID')
    created_by = data.get('createdBy')

    if not title or not eTextbookID or not created_by:
        return False, "Missing required fields", None

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert the E-textbook into the database
        cursor.execute("""
            INSERT INTO ETextbooks (Title, ETextbookID, CreatedBy)
            VALUES (%s, %s, %s)
        """, (title, eTextbookID, created_by))

        connection.commit()
        return True, f" E-textbook created successfully with ID: {eTextbookID}", eTextbookID

    except Exception as e:
        connection.rollback()
        return False, str(e), None

    finally:
        cursor.close()
        connection.close()

def add_chapter(data):
    chapter_number = data.get('chapterNumber')
    chapter_title = data.get('chapterTitle')
    eTextbookID = data.get('eTextbookID')
    created_by = data.get('createdBy')

    if not chapter_number or not chapter_title or not eTextbookID or not created_by:
        return False, "Missing required fields", None

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert the chapter into the database
        cursor.execute("""
            INSERT INTO Chapters (ETextbookID, ChapterNumber, Title, CreatedBy)
            VALUES (%s, %s, %s, %s)
        """, (eTextbookID, chapter_number, chapter_title, created_by))

        connection.commit()
        chapter_id = cursor.lastrowid
        print(chapter_id)
        return True, "Chapter added successfully", chapter_id
    
    except Exception as e:
        connection.rollback()
        return False, str(e), None
    
    finally:
        cursor.close()
        connection.close()

def add_section(data):
    eTextbookID = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_number = data.get('sectionNumber')
    section_title = data.get('sectionTitle')
    created_by = data.get('createdBy')

    print(chapter_id, section_number, section_title, created_by, eTextbookID)
    if not eTextbookID or not chapter_id or not section_number or not section_title or not created_by:
        return False, "Missing required fields", None

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO Sections (ETextbookID ,ChapterID, SectionNumber, Title, CreatedBy)
            VALUES (%s, %s, %s, %s)
        """, (eTextbookID, chapter_id, section_number, section_title, created_by))


        connection.commit()
        section_id = cursor.lastrowid
        return True, "Section added successfully", section_id
    
    except Exception as e:
        connection.rollback()
        return False, str(e), None
    
    finally:
        cursor.close()
        connection.close()

def add_content_block(data):
    section_id = data.get('sectionID')
    content_block_number = data.get('contentBlockNumber')
    content_type = data.get('blockType')  # Either 'Text' or 'Image'
    content = data.get('content')
    created_by = data.get('createdBy')

    print(section_id, content_block_number, content_type, content, created_by)
    if not section_id or not content_block_number or not content_type or not content or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO ContentBlocks (SectionID, BlockNumber, BlockType, Content, CreatedBy)
            VALUES (%s, %s, %s, %s, %s)
        """, (section_id, content_block_number, content_type, content, created_by))


        connection.commit()
        return True, "Section added successfully"
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def add_activity(data):
    section_id = data.get('sectionID')
    content_block_id = data.get('contentBlockID')
    activity_id = data.get('activityID')
    created_by = data.get('createdBy')

    print(section_id, content_block_id, activity_id, created_by)
    if not section_id or not content_block_id or not activity_id or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO ContentBlocks (SectionID, BlockNumber, BlockType, Content, CreatedBy)
            VALUES (%s, %s, %s, %s, %s)
        """, (section_id, content_block_number, content_type, content, created_by))


        connection.commit()
        return True, "Section added successfully"
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()