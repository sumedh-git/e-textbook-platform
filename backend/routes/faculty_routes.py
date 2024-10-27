# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import get_active_course, get_evaluation_course

faculty_bp = Blueprint('faculty', __name__)

@faculty_bp.route('/go-to-active-course', methods=['POST'])
def go_to_active_course():
    data = request.get_json()
    user_id = data.get('user_id')
    course_id = data.get('course_id')

    if not user_id or not course_id:
        return jsonify({"error": "User ID and Course ID are required"}), 400

    course = get_active_course(user_id, course_id)

    if course:
        return jsonify({"message": "Valid Course ID"}), 200
    else:
        return jsonify({"error": "Invalid Course ID"}), 404
    

@faculty_bp.route('/go-to-evaluation-course', methods=['POST'])
def go_to_evaluation_course():
    data = request.get_json()
    user_id = data.get('user_id')
    course_id = data.get('course_id')

    if not user_id or not course_id:
        return jsonify({"error": "User ID and Course ID are required"}), 400

    course = get_evaluation_course(user_id, course_id)

    if course:
        return jsonify({"message": "Valid Course ID"}), 200
    else:
        return jsonify({"error": "Invalid Course ID"}), 404