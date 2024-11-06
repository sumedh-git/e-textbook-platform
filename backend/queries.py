from config import get_db_connection
from datetime import datetime

def generate_user_id(first_name, last_name):
    current_month_year = datetime.now().strftime('%m%y')  # Get current month and year (MMYY)
    return first_name[:2].upper() + last_name[:2].upper() + current_month_year


# Function to create a user (Admin, Faculty, or Student)
def __create_user(data, role):
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

        return True, user_id, f"{role.capitalize()} account created successfully with UserID: {user_id}"
    
    except Exception as e:
        # Rollback in case of any errors
        connection.rollback()
        return False, str(e)
    
    finally:
        # Close cursor and connection
        cursor.close()
        connection.close()


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

def check_ta_role(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT UserID FROM TAs WHERE UserID = %s", (user_id,))
    is_student = cursor.fetchone()
    cursor.close()
    connection.close()
    return is_student is not None

def create_etextbook_query(data):
    title = data.get('title')
    eTextbookID = data.get('eTextbookID')
    created_by = data.get('createdBy')

    if not title or not eTextbookID or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert the E-textbook into the database
        cursor.execute("""
            INSERT INTO ETextbooks (Title, ETextbookID, CreatedBy)
            VALUES (%s, %s, %s)
        """, (title, eTextbookID, created_by))

        connection.commit()
        return True, f" E-textbook created successfully with ID: {eTextbookID}"

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def add_chapter(data):
    chapter_id = data.get('chapterID')
    chapter_title = data.get('chapterTitle')
    eTextbookID = data.get('eTextbookID')
    created_by = data.get('createdBy')

    print(chapter_id, chapter_title, eTextbookID, created_by)
    if not chapter_id or not chapter_title or not eTextbookID or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert the chapter into the database
        cursor.execute("""
            INSERT INTO Chapters (ETextbookID, ChapterID, Title, CreatedBy)
            VALUES (%s, %s, %s, %s)
        """, (eTextbookID, chapter_id, chapter_title, created_by))

        connection.commit()
        print(chapter_id)
        return True, f" Chapter added successfully with ID: {chapter_id}"
    
    except Exception as e:
        connection.rollback()
        return False, str(e), None
    
    finally:
        cursor.close()
        connection.close()

def add_section(data):
    eTextbookID = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    section_title = data.get('sectionTitle')
    created_by = data.get('createdBy')

    print(chapter_id, section_id, section_title, created_by, eTextbookID)
    if not eTextbookID or not chapter_id or not section_id or not section_title or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO Sections (ETextbookID ,ChapterID, SectionID, Title, CreatedBy)
            VALUES (%s, %s, %s, %s, %s)
        """, (eTextbookID, chapter_id, section_id, section_title, created_by))


        connection.commit()
        section_id = cursor.lastrowid
        return True, f" Section added successfully with ID: {section_id}"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def add_content_block(data):
    eTextbookID = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    content_block_id = data.get('contentBlockID')
    content_type = data.get('blockType')
    content = data.get('content')
    created_by = data.get('createdBy')

    print(eTextbookID, chapter_id, section_id, content_block_id, content_type, content, created_by)
    if not eTextbookID or not chapter_id or not section_id or not content_block_id or not content_type or not content or not created_by:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO ContentBlocks (eTextbookID, chapterID, SectionID, BlockID, BlockType, Content, CreatedBy)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (eTextbookID, chapter_id, section_id, content_block_id, content_type, content, created_by))


        connection.commit()
        return True, f"Content Block added successfully with ID: {content_block_id}"
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def add_activity(data):
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    content_block_id = data.get('contentBlockID')
    activity_id = data.get('activityID')
    created_by = data.get('createdBy')

    print(etextbook_id, chapter_id, section_id, content_block_id, activity_id, created_by)
    if not etextbook_id or not chapter_id or not section_id or not content_block_id or not activity_id or not created_by:
        return False, "Missing required fields"
    
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO Activities (ActivityID, ETextbookID, ChapterID, SectionID, BlockID, CreatedBy)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (activity_id, etextbook_id, chapter_id, section_id, content_block_id, created_by))
        connection.commit()
        return True, "Activity added successfully"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()

def add_question(data):
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    content_block_id = data.get('contentBlockID')
    activity_id = data.get('activityID')
    question_id = data.get('questionID')
    question_text = data.get('questionText')
    options = data.get('options')  # Dictionary with options 1-4 and explanations
    answer_idx = data.get('answerIdx')  # Integer index for correct answer
    created_by = data.get('createdBy')

    print(etextbook_id, chapter_id, section_id, content_block_id, activity_id, question_id, question_text, options, answer_idx, created_by)
    if not etextbook_id or not chapter_id or not section_id or not content_block_id or not activity_id or not question_id or not question_text or not options or not answer_idx or not created_by:
        return False, "Missing required fields"
    
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert Question with Options and Correct Answer Index
        query = """
            INSERT INTO Questions (
                QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID,
                QuestionText, Option1, Option1Explanation, Option2, Option2Explanation,
                Option3, Option3Explanation, Option4, Option4Explanation, AnswerIdx, CreatedBy
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        # Extract option details from the options array
        option_values = [
            options[0]['text'], options[0]['explanation'],
            options[1]['text'], options[1]['explanation'],
            options[2]['text'], options[2]['explanation'],
            options[3]['text'], options[3]['explanation']
        ]

        cursor.execute(query, (
            question_id, etextbook_id, chapter_id, section_id, content_block_id, activity_id, 
            question_text, *option_values, answer_idx, created_by
        ))
        
        connection.commit()
        return True, "Question added successfully"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()

def change_user_password(user_id, new_password):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Update the password in the Users table
        cursor.execute("UPDATE Users SET Password = %s WHERE UserID = %s", (new_password, user_id))
        connection.commit()
        return True, "Password updated successfully"
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def get_faculty_active_course(user_id, course_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT ac.CourseID, c.ETextbookID FROM ActiveCourses ac
        JOIN Courses c ON ac.CourseID = c.CourseID
        WHERE ac.CourseID = %s AND c.FacultyID = %s
    """

    cursor.execute(query, (course_id, user_id))
    course = cursor.fetchone()
    print(course)
    cursor.close()
    connection.close()
    return course

def get_evaluation_course(user_id, course_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT CourseID, ETextbookID FROM Courses
        WHERE CourseID = %s AND FacultyID = %s AND Type = "Evaluation"
    """

    cursor.execute(query, (course_id, user_id))
    course = cursor.fetchone()

    cursor.close()
    connection.close()
    return course

def get_faculty_courses(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT * FROM Courses
        WHERE FacultyID = %s
    """

    cursor.execute(query, (user_id,))
    courses = cursor.fetchall()

    cursor.close()
    connection.close()
    return courses


def get_ta_courses(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT * FROM Courses
        WHERE TAID = %s
    """

    cursor.execute(query, (user_id,))
    courses = cursor.fetchall()

    cursor.close()
    connection.close()
    return courses

def get_ta_active_course(user_id, course_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT ac.CourseID FROM ActiveCourses ac
        JOIN Courses c ON ac.CourseID = c.CourseID
        WHERE ac.CourseID = %s AND c.TAID = %s
    """

    cursor.execute(query, (course_id, user_id))
    course = cursor.fetchone()

    cursor.close()
    connection.close()
    return course


def get_students_from_course(course_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        SELECT 
            e.StudentID, 
            u.FirstName, 
            u.LastName
        FROM 
            Enrollments e
        JOIN 
            Students s ON e.StudentID = s.UserID
        JOIN 
            Users u ON s.UserID = u.UserID
        WHERE 
            e.CourseID = %s;
    """

    cursor.execute(query, (course_id,))
    students = cursor.fetchall()
    print(students)

    cursor.close()
    connection.close()
    return students

def check_etextbook_exists(eTextbookID):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM ETextbooks WHERE ETextbookID = %s", (eTextbookID,))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    connection.close()
    return exists

def check_chapter_exists(eTextbookID, chapterID):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM Chapters WHERE ETextbookID = %s AND ChapterID = %s", (eTextbookID, chapterID))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    connection.close()
    return exists

def check_section_exists(etextbook_id, chapter_id, section_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT COUNT(*) 
        FROM Sections 
        WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s
    """, (etextbook_id, chapter_id, section_id))
    exists = cursor.fetchone()[0] > 0
    cursor.close()
    connection.close()
    return exists

def check_content_block_exists(etextbook_id, chapter_id, section_id, content_block_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT COUNT(*)
        FROM ContentBlocks
        WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s
    """, (etextbook_id, chapter_id, section_id, content_block_id))
    exists = cursor.fetchone()[0] > 0
    print("value of exists:",exists)
    cursor.close()
    connection.close()
    return exists

def check_faculty_exists(faculty_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM Faculties WHERE UserID = %s", (faculty_id,))
        faculty_exists = cursor.fetchone()[0] > 0
        return faculty_exists

    finally:
        cursor.close()
        connection.close()


def modify_content_block(data):
    eTextbookID = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    content_block_id = data.get('contentBlockID')
    new_content_type = data.get('type')  # Assume this is the new type to update
    new_content = data.get('contentData')  # Assume this is the new content to update
    updated_by = data.get('updatedBy')  # User updating the content block

    print(eTextbookID, chapter_id, section_id, content_block_id, new_content_type, new_content, updated_by)
    # Check that all necessary fields are present
    if not all([eTextbookID, chapter_id, section_id, content_block_id, new_content_type, new_content, updated_by]):
        return False, "Missing required fields"

    # Execute the query
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            DELETE FROM ContentBlocks
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s
        """, (eTextbookID, chapter_id, section_id, content_block_id))

        # Reinsert the content block with updated type and content
        cursor.execute("""
            INSERT INTO ContentBlocks (ETextbookID, ChapterID, SectionID, BlockID, BlockType, Content, CreatedBy)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (eTextbookID, chapter_id, section_id, content_block_id, new_content_type, new_content, updated_by))

        connection.commit()

        connection.commit()
        return True, f"Content Block {content_block_id} modified successfully."

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def modify_question(data):
    eTextbookID = data.get('eTextbookID')
    chapterID = data.get('chapterID')
    sectionID = data.get('sectionID')
    blockID = data.get('contentBlockID')
    activityID = data.get('activityID')
    questionID = data.get('questionID')
    questionText = data.get('questionText')
    options = data.get('options')
    answerIdx = data.get('answerIdx')
    createdBy = data.get('createdBy')

    # Ensure all necessary fields are present
    if not all([eTextbookID, chapterID, sectionID, blockID, activityID, questionID, questionText, options, answerIdx, createdBy]):
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Step 1: Delete the existing content block (cascading deletion of activity and question)
        cursor.execute("""
            DELETE FROM ContentBlocks 
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s
        """, (eTextbookID, chapterID, sectionID, blockID))

        # Step 2: Insert the new content block with block type 'activity' and content as activityID
        cursor.execute("""
            INSERT INTO ContentBlocks (BlockID, ETextbookID, ChapterID, SectionID, BlockType, Content, CreatedBy)
            VALUES (%s, %s, %s, %s, 'activity', %s, %s)
        """, (blockID, eTextbookID, chapterID, sectionID, activityID, createdBy))

        # Step 3: Insert or update the associated activity and question
        cursor.execute("""
            INSERT INTO Activities (ActivityID, ETextbookID, ChapterID, SectionID, BlockID, CreatedBy)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE ActivityID = VALUES(ActivityID)
        """, (activityID, eTextbookID, chapterID, sectionID, blockID, createdBy))

        # Insert or update the question
        cursor.execute("""
            INSERT INTO Questions (QuestionID, ETextbookID, ChapterID, SectionID, BlockID, ActivityID, QuestionText,
                Option1, Option1Explanation, Option2, Option2Explanation, Option3, Option3Explanation, 
                Option4, Option4Explanation, AnswerIdx, CreatedBy)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                QuestionText = VALUES(QuestionText),
                Option1 = VALUES(Option1), Option1Explanation = VALUES(Option1Explanation),
                Option2 = VALUES(Option2), Option2Explanation = VALUES(Option2Explanation),
                Option3 = VALUES(Option3), Option3Explanation = VALUES(Option3Explanation),
                Option4 = VALUES(Option4), Option4Explanation = VALUES(Option4Explanation),
                AnswerIdx = VALUES(AnswerIdx),
                CreatedBy = VALUES(CreatedBy)
        """, (
            questionID, eTextbookID, chapterID, sectionID, blockID, activityID, questionText,
            options[0]['text'], options[0]['explanation'],
            options[1]['text'], options[1]['explanation'], options[2]['text'],
            options[2]['explanation'], options[3]['text'], options[3]['explanation'],
            answerIdx, createdBy
        ))

        connection.commit()
        return True, "Question and activity modified successfully."

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def create_active_course(data):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        if not check_faculty_exists(data['facultyID']):
            return False, "The specified faculty member does not exist."
        
        if not check_etextbook_exists(data['eTextbookID']):
            return False, "The specified e-textbook does not exist."

        # Insert into Courses table
        cursor.execute("""
            INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID)
            VALUES (%s, %s, %s, %s, %s, 'Active', %s)
        """, (data['courseID'], data['courseName'], data['facultyID'], data['startDate'], data['endDate'], data['eTextbookID']))

        # Insert into ActiveCourses table
        cursor.execute("""
            INSERT INTO ActiveCourses (CourseID, Token, Capacity)
            VALUES (%s, %s, %s)
        """, (data['courseID'], data['token'], data['capacity']))

        connection.commit()
        return True, f"Active course '{data['courseName']}' created successfully"

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def create_evaluation_course(data):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        if not check_faculty_exists(data['facultyID']):
            return False, "The specified faculty member does not exist."
        
        if not check_etextbook_exists(data['eTextbookID']):
            return False, "The specified e-textbook does not exist."

        # Insert into Courses table as Evaluation course
        cursor.execute("""
            INSERT INTO Courses (CourseID, Title, FacultyID, StartDate, EndDate, Type, ETextbookID)
            VALUES (%s, %s, %s, %s, %s, 'Evaluation', %s)
        """, (data['courseID'], data['courseName'], data['facultyID'], data['startDate'], data['endDate'], data['eTextbookID']))

        connection.commit()
        return True, f"Evaluation course '{data['courseName']}' created successfully"

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def hide_chapter(data):
    eTextbookID = data.get('eTextbookID')
    chapterID = data.get('chapterID')

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Check if the chapter exists
        cursor.execute("""
            SELECT 1 FROM Chapters
            WHERE ETextbookID = %s AND ChapterID = %s
        """, (eTextbookID, chapterID))
        exists = cursor.fetchone()

        if not exists:
            return False, "Chapter not found."

        # Proceed to hide the chapter if it exists
        cursor.execute("""
            UPDATE Chapters
            SET IsHidden = TRUE
            WHERE ETextbookID = %s AND ChapterID = %s
        """, (eTextbookID, chapterID))

        if cursor.rowcount > 0:
            connection.commit()
            return True, "Chapter hidden successfully."
        else:
            return False, "Failed to hide the chapter."

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()


def delete_chapter(data):
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    user_id = data.get('userID')
    
    if not etextbook_id or not chapter_id or not user_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Call the stored procedure to delete the chapter
        cursor.callproc("DeleteChapterByFacultyOrTA", (user_id, etextbook_id, chapter_id))

        # Fetch results from the stored procedure
        result = cursor.fetchone()
        if result:
            return True, result[0]  # Return the success message

        connection.commit()
        return True, "Chapter deleted successfully."

    except Exception as e:
        connection.rollback()
        return False, f"Failed to delete chapter: {str(e)}"

    finally:
        cursor.close()
        connection.close()

def hide_section(data): 
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')

    if not etextbook_id or not chapter_id or not section_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT 1 FROM Sections
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s
        """, (etextbook_id, chapter_id, section_id))
        exists = cursor.fetchone()

        if not exists:
            return False, "Section not found."
        
        cursor.execute("""
            UPDATE Sections
            SET IsHidden = TRUE
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s
        """, (etextbook_id, chapter_id, section_id))
        
        connection.commit()
        return True, "Section hidden successfully."
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def delete_section(data):
    user_id = data.get('userID')
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')

    print(user_id, etextbook_id, chapter_id, section_id)
    if not user_id or not etextbook_id or not chapter_id or not section_id:
        return False, "Missing required fields"
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.callproc("DeleteSectionByFacultyOrTA", (user_id, etextbook_id, chapter_id, section_id))
        
        # Fetch results from the stored procedure
        result = cursor.fetchone()
        if result:
            return True, result[0]  # Return the success message

        connection.commit()
        return True, "Section deleted successfully."
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()


def add_ta_to_course(data):
    courseID = data.get('courseID')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    print(courseID, firstName, lastName, email, password)
    if not all([courseID, firstName, lastName, email, password]):
        return False, "Missing required fields."

    user_id = generate_user_id(firstName, lastName)
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Check if email is already registered
        cursor.execute("SELECT UserID FROM Users WHERE Email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            ta_user_id = existing_user[0]
            # Check if this user is already a TA for the course
            cursor.execute("SELECT * FROM CourseTAs WHERE CourseID = %s AND TAID = %s", (courseID, ta_user_id))
            if cursor.fetchone():
                return False, "TA already associated with this course."
        else:
            # Insert into Users table
            cursor.execute(
                """
                INSERT INTO Users (UserID, FirstName, LastName, Email, Password)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (user_id,firstName, lastName, email, password)
            )
            # Insert into TAs table
            cursor.execute("INSERT INTO TAs (UserID) VALUES (%s)", (user_id,))

        # Associate TA with the course in CourseTAs table
        cursor.execute(
            "INSERT INTO CourseTAs (CourseID, TAID) VALUES (%s, %s)",
            (courseID, user_id)
        )

        connection.commit()
        return True, "TA added to course successfully."
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def hide_activity(data): 
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    block_id = data.get('contentBlockID')
    activity_id = data.get('activityID')

    if not etextbook_id or not chapter_id or not section_id or not block_id or not activity_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT 1 FROM Activities
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s AND ActivityID = %s
        """, (etextbook_id, chapter_id, section_id, block_id, activity_id))
        exists = cursor.fetchone()

        if not exists:
            return False, "Activity not found."
        
        cursor.execute("""
            UPDATE Activities
            SET IsHidden = TRUE
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s AND ActivityID = %s
        """, (etextbook_id, chapter_id, section_id, block_id, activity_id))
        
        connection.commit()
        return True, "Activity hidden successfully."
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def delete_activity(data):
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    block_id = data.get('contentBlockID')
    activity_id = data.get('activityID')
    user_id = data.get('userID')
    
    if not etextbook_id or not chapter_id or not section_id or not block_id or not activity_id or not user_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Call the stored procedure to delete the activity
        cursor.callproc("DeleteActivityByFacultyOrTA", (user_id, etextbook_id, chapter_id, section_id, block_id, activity_id))

        # Fetch results from the stored procedure
        result = cursor.fetchone()
        if result:
            return True, result[0]  # Return the success message

        connection.commit()
        return True, "Activity deleted successfully."

    except Exception as e:
        connection.rollback()
        return False, f"Failed to delete activity: {str(e)}"

    finally:
        cursor.close()
        connection.close()

def hide_content_block(data): 
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    block_id = data.get('contentBlockID')

    if not etextbook_id or not chapter_id or not section_id or not block_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            SELECT 1 FROM ContentBlocks
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s
        """, (etextbook_id, chapter_id, section_id, block_id))
        exists = cursor.fetchone()

        if not exists:
            return False, "Content block not found."

        cursor.execute("""
            UPDATE ContentBlocks
            SET IsHidden = TRUE
            WHERE ETextbookID = %s AND ChapterID = %s AND SectionID = %s AND BlockID = %s
        """, (etextbook_id, chapter_id, section_id, block_id))
        
        connection.commit()
        return True, "Content Block hidden successfully."
    
    except Exception as e:
        connection.rollback()
        return False, str(e)
    
    finally:
        cursor.close()
        connection.close()

def delete_content_block(data):
    etextbook_id = data.get('eTextbookID')
    chapter_id = data.get('chapterID')
    section_id = data.get('sectionID')
    block_id = data.get('contentBlockID')
    user_id = data.get('userID')
    
    if not etextbook_id or not chapter_id or not section_id or not block_id or not user_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Call the stored procedure to delete the content block
        cursor.callproc("DeleteContentBlockByFacultyOrTA", (user_id, etextbook_id, chapter_id, section_id, block_id))

        # Fetch results from the stored procedure
        result = cursor.fetchone()
        if result:
            return True, result[0]  # Return the success message

        connection.commit()
        return True, "Content block deleted successfully."

    except Exception as e:
        connection.rollback()
        return False, f"Failed to delete content block: {str(e)}"

    finally:
        cursor.close()
        connection.close()

def view_worklist(course_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        SELECT u.UserID, u.FirstName, u.LastName FROM Enrollments e JOIN Students s ON e.StudentID = s.UserID JOIN Users u ON s.UserID = u.UserID WHERE e.EnrollmentStatus = 'Pending' AND e.CourseID = %s;
    """
    cursor.execute(query, (course_id,))
    worklist = cursor.fetchall()
    
    cursor.close()
    connection.close()
    return worklist

def approve_enrollment(student_id, course_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Call stored procedure to approve enrollment
        cursor.callproc('ApproveEnrollment', (student_id, course_id))

        # Fetch the result message returned by the procedure
        result = cursor.fetchone()
        connection.commit()
        
        return True, result[0] if result else "Enrollment approved successfully."

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def get_student_user_id_by_details(data):
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')

    # Check if all required fields are present in data
    if not all([email, first_name, last_name]):
        return None     

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Correct the query syntax and ensure placeholders are correct
        query = """
            SELECT UserID FROM Users 
            WHERE Email = %s AND FirstName = %s AND LastName = %s
        """
        # Execute query with parameters to prevent SQL injection
        cursor.execute(query, (email, first_name, last_name))
        
        # Fetch the result
        student_id = cursor.fetchone()
        
        if student_id:
            student_id = student_id[0]
        else:
            return None

    except Exception as e:
        return None

    finally:
        cursor.close()
        connection.close()

    return student_id

def get_course_details_by_token(token):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Since each user has only 1 role, we can use this query directly
    query = """
        SELECT CourseID,Capacity FROM activecourses WHERE Token LIKE %s;
    """
    cursor.execute(query, (token,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result

def get_current_enrollment_count_by_course_id(token):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT COUNT(*) FROM Enrollments WHERE CourseID=%s AND EnrollmentStatus='Enrolled';
    """
    cursor.execute(query, (token,))
    enrollment_count = cursor.fetchone()
    cursor.close()
    connection.close()
    return enrollment_count

def create_enrollment(course_id, student_id):
    if not course_id or not student_id:
        return False, "Missing required fields"

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert the enrollment into the database
        cursor.execute("""
            INSERT INTO Enrollments (CourseID, StudentID, EnrollmentStatus)
            VALUES (%s, %s,"Pending")
        """, (course_id, student_id))

        connection.commit()
        return True, f" Student has been added to waitlist."

    except Exception as e:
        connection.rollback()
        return False, str(e)

    finally:
        cursor.close()
        connection.close()

def get_students_textbooks(student_user_id):    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT 
            et.ETextbookID,
            et.Title AS textbook_title,
            c.ChapterID,
            c.Title AS chapter_title,
            s.SectionID,
            s.Title AS section_title
        FROM 
            Enrollments e
        JOIN 
            Courses cr ON e.CourseID = cr.CourseID AND cr.Type LIKE 'Active'
        JOIN 
            ETextbooks et ON cr.ETextbookID = et.ETextbookID
        JOIN 
            Chapters c ON et.ETextbookID = c.ETextbookID
        JOIN 
            Sections s ON c.ETextbookID = s.ETextbookID AND c.ChapterID = s.ChapterID
        WHERE 
            e.StudentID = %s AND e.EnrollmentStatus = 'Enrolled' AND
            c.IsHidden IS FALSE AND 
            s.IsHidden IS FALSE
        ORDER BY 
            et.ETextbookID, c.ChapterID, s.SectionID;
    """
    cursor.execute(query,(student_user_id,))
    result = cursor.fetchall()
    cursor.close()
    connection.close()
    return result

def check_textbook_accessible_by_student(data):
    student_user_id=data.get("student_user_id")
    eTextbook_id=data.get("eTextbook_id")

    if not all([student_user_id, eTextbook_id]):
        return None
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT 1
        FROM Enrollments e
        JOIN Courses c ON e.CourseID = c.CourseID
        WHERE e.StudentID = %s AND e.EnrollmentStatus = 'Enrolled'
            AND c.ETextbookID = %s AND c.Type = 'Active';
    """, (student_user_id, eTextbook_id))

    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result

def get_content_blocks(data):
    eTextbook_id=data.get("eTextbook_id")
    chapter_id=data.get("chapter_id")
    section_id=data.get("section_id")

    if not all([eTextbook_id, chapter_id, section_id]):
        return None
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT 
            cb.BlockID, 
            cb.BlockType, 
            cb.Content
        FROM ContentBlocks cb
        WHERE cb.ETextbookID = %s AND cb.ChapterID = %s AND cb.SectionID = %s AND cb.IsHidden = FALSE
        ORDER BY cb.BlockID;
    """, (eTextbook_id,chapter_id, section_id))

    content_blocks = cursor.fetchall()
    cursor.close()
    connection.close()
    return content_blocks

def get_question_query(data):
    eTextbook_id=data.get("eTextbook_id")
    chapter_id=data.get("chapter_id")
    section_id=data.get("section_id")
    block_id=data.get("block_id")
    activity_id=data.get("activity_id")

    if not all([eTextbook_id, chapter_id, section_id,activity_id]):
        return None
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT 
            QuestionID,
            QuestionText,
            Option1,
            Option1Explanation,
            Option2,
            Option2Explanation,
            Option3,
            Option3Explanation,
            Option4,
            Option4Explanation,
            AnswerIdx FROM Questions AS q
        WHERE q.ETextbookID = %s AND q.ChapterID = %s AND q.SectionID = %s AND q.BlockID = %s AND q.ActivityID = %s;
    """, (eTextbook_id,chapter_id, section_id,block_id,activity_id))

    content_blocks = cursor.fetchall()
    cursor.close()
    connection.close()
    return content_blocks


def insert_or_update_points(data):
    eTextbook_id = data.get('eTextbook_id')
    chapter_id = data.get('chapter_id')
    section_id = data.get('section_id')
    block_id = data.get('block_id')
    activity_id = data.get('activity_id')
    question_id = data.get('question_id')
    student_user_id = data.get('student_user_id')
    
    if not all([eTextbook_id, chapter_id, section_id,activity_id,block_id,student_user_id,question_id]):
        return False, "All details are required"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT Points 
            FROM StudentActivity 
            WHERE 
            ETextbookID=%s AND 
            ChapterID=%s AND 
            SectionID=%s AND 
            BlockID=%s AND 
            ActivityID=%s AND 
            QuestionID=%s AND
            StudentID=%s;""", (eTextbook_id, chapter_id, section_id,block_id,activity_id,question_id,student_user_id))
        result = cursor.fetchone()

        if not result:
            print("Insert a new score record if none exists")
            cursor.execute("INSERT INTO StudentActivity VALUES (%s, %s,%s,%s,%s,%s,%s,%s)", (question_id,eTextbook_id, chapter_id, section_id,block_id,activity_id,student_user_id,1))
        conn.commit()
        return True, "Score updated successfully"
    except Exception as e:
        return False, "Failed to update score"
    finally:
        cursor.close()
        conn.close()


def get_student_activity_points(student_user_id):
    print(student_user_id)
    if not student_user_id:
        return False, "Student User ID is required"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Points,
                ETextbookID,
                ChapterID,
                SectionID,
                BlockID,
                ActivityID,
                QuestionID, 
                Points
            FROM StudentActivity 
            WHERE 
            StudentID=%s;""", (student_user_id))
        result = cursor.fetchall()

        if not result:
            print("Could not find activity points for student")
            return False, "No records found"
    except Exception as e:
        return False, "Failed to fetch student participation activity points"
    finally:
        cursor.close()
        conn.close()