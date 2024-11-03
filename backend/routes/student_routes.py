# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import (
    get_student_user_id_by_details,
    get_course_details_by_token,
    create_enrollment,
    get_current_enrollment_count_by_course_id,
    create_user
)

student_bp = Blueprint('student', __name__)

@student_bp.route('/enroll-student', methods=['POST'])
def enroll_student():
    data = request.get_json()

    # Extract student and enrollment data
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    password = data.get('password')
    email = data.get('email')
    enrollment_token = data.get('enrollmentToken')

    # Ensure all required data is present
    if not all([email, enrollment_token, first_name, last_name, password]):
        return jsonify({"error": "All student details and course enrollment token are required"}), 400

    # Get course details by token
    course_details = get_course_details_by_token(enrollment_token)
    if not course_details:
        return jsonify({"error": "Course with the given enrollment token does not exist"}), 404

    course_id, course_capacity = course_details

    # Get student ID by email
    student_user_id = get_student_user_id_by_details(data)
    if student_user_id is None: 
        # Register student if not registered already
        success, user_id, register_message = create_user(data, role='student')
        if not success: 
            #  Return error if student registration fails
            return jsonify({"error": f"Unable to register student. {register_message}"}), 500
        student_user_id = user_id

    # Check current enrollment count for the course
    current_enrollment_count = get_current_enrollment_count_by_course_id(course_id)
    if current_enrollment_count is None:
        return jsonify({"error": f"Error while retrieving current enrollment count for course {course_id}"}), 500

    # Enroll student if capacity allows
    if current_enrollment_count[0] < course_capacity:
        success, enrollment_message = create_enrollment(student_id=student_user_id, course_id=course_id)
        if success:
            return jsonify({"message": f"Successfully enrolled in course {course_id}"}), 201
        else:
            return jsonify({"error": f"Enrollment failed: {enrollment_message}"}), 400
    else:
        return jsonify({"error": f"Course {course_id} is at full capacity. Cannot enroll at this time."}), 400
