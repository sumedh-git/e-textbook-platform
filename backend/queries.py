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
            return False, None, "A user with this email or UserID already exists."

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
            return False, None, "Invalid role specified."

        # Commit the transaction
        connection.commit()

        return True, user_id, f"{role.capitalize()} account created successfully with UserID: {user_id}"
    
    except Exception as e:
        # Rollback in case of any errors
        connection.rollback()
        return False, None, str(e)
    
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
        SELECT ac.CourseID FROM ActiveCourses ac
        JOIN Courses c ON ac.CourseID = c.CourseID
        WHERE ac.CourseID = %s AND c.FacultyID = %s
    """

    cursor.execute(query, (course_id, user_id))
    course = cursor.fetchone()

    cursor.close()
    connection.close()
    return course

def get_evaluation_course(user_id, course_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = """
        SELECT CourseID FROM Courses
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
