# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import get_student_user_id_by_email

student_bp = Blueprint('student', __name__)

@student_bp.route('/enroll-student', methods=['POST'])
def enroll_student():
    data = request.get_json()
    email = data.get('email')
    # enrollment_token = data.get('token')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    student_user_id = get_student_user_id_by_email(email)
    # course_id = get_course_id_by_token(enrollment_token)

    if not student_user_id:
        # Create student account
        return jsonify({"error": "Student Account Does not exist"}), 404 # modify this when application flow is updated
    # if not course_id:
    #     return jsonify({"error": "Course with given enrollment does not exist"}), 404
    
    
