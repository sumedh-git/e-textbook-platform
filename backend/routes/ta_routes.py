# backend/routes/admin_routes.py
from flask import Blueprint, request, jsonify
from queries import get_ta_active_course, get_ta_courses, get_students_from_course, hide_chapter, delete_chapter, hide_section, delete_section, delete_activity

ta_bp = Blueprint('ta', __name__)

@ta_bp.route('/go-to-active-course', methods=['POST'])
def go_to_active_course():
    data = request.get_json()
    user_id = data.get('user_id')
    course_id = data.get('course_id')

    if not user_id or not course_id:
        return jsonify({"error": "User ID and Course ID are required"}), 400

    course = get_ta_active_course(user_id, course_id)

    if course:
        return jsonify({"message": "Valid Course ID", "course_id": course[0], "etextbook_id": course[1]}), 200
    else:
        return jsonify({"error": "Invalid Course ID"}), 404

@ta_bp.route('/view-courses', methods=['POST'])
def view_courses():
    data = request.get_json()
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User login is required"}), 400

    courses = get_ta_courses(user_id)

    # Check if courses were found
    if not courses:
        return jsonify({"message": "No courses found for this TA."}), 404

    # Return the list of courses as a JSON response
    return jsonify(courses), 200

@ta_bp.route("/view-students", methods=["POST"])
def view_students():
    data = request.get_json()
    course_id = data.get('course_id')

    if not course_id:
        return jsonify({"error": "No such Active Course"}), 400
    
    students = get_students_from_course(course_id)

    if not students:
        return jsonify({"message": "No students enrolled for this course"}), 404
    
    return jsonify(students), 200

@ta_bp.route('/hide-chapter', methods=['POST'])
def hide_chapter_route():
    data = request.json
    success, message = hide_chapter(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    

@ta_bp.route('/delete-chapter', methods=['POST'])
def delete_chapter_route():
    data = request.json
    success, message = delete_chapter(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    
@ta_bp.route('/hide-section', methods=['POST'])
def hide_section_route():
    data = request.json
    success, message = hide_section(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    
@ta_bp.route('/delete-section', methods=['POST'])
def delete_section_route():
    data = request.json
    success, message = delete_section(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400

@ta_bp.route('/delete-activity', methods=['POST'])
def delete_activity_route():
    data = request.json
    success, message = delete_activity(data)
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400